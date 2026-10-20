from uuid import uuid4

import pytest
from sqlalchemy import text

pytestmark = pytest.mark.integration

FORO = "/api/v1/foro"
PUBLICACION = {
    "categoria": "museo",
    "titulo": "¿Qué objeto les impactó más?",
    "contenido": "En la última edición del museo vi el altar de la sanación.",
    "autor": "Ana",
}


def publicar(client, **cambios) -> dict:
    respuesta = client.post(f"{FORO}/publicaciones", json={**PUBLICACION, **cambios})
    assert respuesta.status_code == 201, respuesta.text
    return respuesta.json()


def comentar(client, publicacion_id: int, **datos) -> dict:
    cuerpo = {"contenido": "Buen aporte", "autor": "Luis", **datos}
    respuesta = client.post(f"{FORO}/publicaciones/{publicacion_id}/comentarios", json=cuerpo)
    assert respuesta.status_code == 201, respuesta.text
    return respuesta.json()


def votar(client, ruta: str, votante, valor: int):
    return client.put(f"{FORO}/{ruta}/voto", json={"votante": str(votante), "valor": valor})


def titulos(client, **params) -> list[str]:
    respuesta = client.get(f"{FORO}/publicaciones", params=params)
    assert respuesta.status_code == 200
    return [p["titulo"] for p in respuesta.json()["elementos"]]


def test_publica_y_devuelve_la_publicacion_sin_votos(bd_limpia, client):
    creada = publicar(client, titulo="  Espacios recortados  ")

    assert creada["titulo"] == "Espacios recortados"
    assert creada["puntaje"] == 0
    assert creada["comentarios"] == 0
    assert creada["mi_voto"] == 0
    detalle = client.get(f"{FORO}/publicaciones/{creada['id']}").json()
    assert detalle == creada


@pytest.mark.parametrize(
    "cambios",
    [
        {"categoria": "inventada"},
        {"titulo": "Hola"},
        {"autor": "A"},
        {"contenido": "   "},
        {"otro": "campo"},
    ],
)
def test_valida_las_publicaciones(bd_limpia, client, cambios):
    respuesta = client.post(f"{FORO}/publicaciones", json={**PUBLICACION, **cambios})

    assert respuesta.status_code == 422


def test_filtra_por_categoria_y_pagina(bd_limpia, client):
    publicar(client, titulo="Sobre el museo")
    publicar(client, titulo="Sobre la salida", categoria="salidas")

    respuesta = client.get(f"{FORO}/publicaciones", params={"categoria": "salidas", "limite": 1})

    cuerpo = respuesta.json()
    assert [p["titulo"] for p in cuerpo["elementos"]] == ["Sobre la salida"]
    assert cuerpo["total"] == 1


def test_ordena_por_recientes_mejores_y_populares(bd_limpia, client):
    vieja = publicar(client, titulo="Publicación vieja")
    nueva = publicar(client, titulo="Publicación nueva")
    for _ in range(3):
        votar(client, f"publicaciones/{vieja['id']}", uuid4(), 1)
    votar(client, f"publicaciones/{nueva['id']}", uuid4(), 1)

    assert titulos(client, orden="recientes") == ["Publicación nueva", "Publicación vieja"]
    assert titulos(client, orden="mejores") == ["Publicación vieja", "Publicación nueva"]
    # Con la misma antigüedad, populares favorece la actividad.
    assert titulos(client) == ["Publicación vieja", "Publicación nueva"]


async def test_populares_deja_caer_lo_antiguo_aunque_tenga_votos(bd_limpia, client):
    antigua = publicar(client, titulo="Debate de hace un mes")
    publicar(client, titulo="Pregunta de hoy")
    votar(client, f"publicaciones/{antigua['id']}", uuid4(), 1)
    async with bd_limpia.engine.begin() as conexion:
        await conexion.execute(
            text(
                "UPDATE publicaciones_foro SET creado_en = now() - interval '30 days' "
                "WHERE id = :id"
            ),
            {"id": antigua["id"]},
        )

    assert titulos(client) == ["Pregunta de hoy", "Debate de hace un mes"]


def test_un_votante_tiene_un_solo_voto_que_puede_cambiar_o_retirar(bd_limpia, client):
    publicacion = publicar(client)
    ruta = f"publicaciones/{publicacion['id']}"
    ana, luis = uuid4(), uuid4()

    assert votar(client, ruta, ana, 1).json() == {"puntaje": 1, "mi_voto": 1}
    assert votar(client, ruta, ana, 1).json() == {"puntaje": 1, "mi_voto": 1}
    assert votar(client, ruta, luis, -1).json()["puntaje"] == 0
    assert votar(client, ruta, ana, -1).json()["puntaje"] == -2
    assert votar(client, ruta, ana, 0).json() == {"puntaje": -1, "mi_voto": 0}


def test_cada_visitante_ve_su_propio_voto(bd_limpia, client):
    publicacion = publicar(client)
    ana = uuid4()
    votar(client, f"publicaciones/{publicacion['id']}", ana, -1)

    def mi_voto(**params):
        return client.get(f"{FORO}/publicaciones", params=params).json()["elementos"][0]["mi_voto"]

    assert mi_voto(votante=str(ana)) == -1
    assert mi_voto(votante=str(uuid4())) == 0
    assert mi_voto() == 0
    detalle = client.get(f"{FORO}/publicaciones/{publicacion['id']}", params={"votante": str(ana)})
    assert detalle.json()["mi_voto"] == -1


@pytest.mark.parametrize("valor", [2, -2, "arriba"])
def test_rechaza_votos_con_valores_no_validos(bd_limpia, client, valor):
    publicacion = publicar(client)

    assert votar(client, f"publicaciones/{publicacion['id']}", uuid4(), valor).status_code == 422


def test_rechaza_votantes_que_no_son_uuid(bd_limpia, client):
    publicacion = publicar(client)
    respuesta = client.put(
        f"{FORO}/publicaciones/{publicacion['id']}/voto", json={"votante": "yo", "valor": 1}
    )

    assert respuesta.status_code == 422


def test_comentarios_en_hilo_y_contador_de_la_publicacion(bd_limpia, client):
    publicacion = publicar(client)
    raiz = comentar(client, publicacion["id"], contenido="Primer comentario")
    respuesta = comentar(client, publicacion["id"], contenido="Respuesta", padre_id=raiz["id"])
    ana = uuid4()
    votar(client, f"comentarios/{respuesta['id']}", ana, 1)

    comentarios = client.get(
        f"{FORO}/publicaciones/{publicacion['id']}/comentarios", params={"votante": str(ana)}
    ).json()

    assert [(c["contenido"], c["padre_id"]) for c in comentarios] == [
        ("Primer comentario", None),
        ("Respuesta", raiz["id"]),
    ]
    assert [(c["puntaje"], c["mi_voto"]) for c in comentarios] == [(0, 0), (1, 1)]
    assert client.get(f"{FORO}/publicaciones/{publicacion['id']}").json()["comentarios"] == 2


def test_no_se_responde_a_comentarios_de_otra_publicacion(bd_limpia, client):
    una, otra = publicar(client), publicar(client)
    ajeno = comentar(client, otra["id"])

    respuesta = client.post(
        f"{FORO}/publicaciones/{una['id']}/comentarios",
        json={"contenido": "Hola", "autor": "Luis", "padre_id": ajeno["id"]},
    )

    assert respuesta.status_code == 422
    assert "misma publicación" in respuesta.json()["detail"]


@pytest.mark.parametrize(
    ("metodo", "ruta", "cuerpo"),
    [
        ("get", "publicaciones/999", None),
        ("get", "publicaciones/999/comentarios", None),
        ("post", "publicaciones/999/comentarios", {"contenido": "Hola", "autor": "Luis"}),
        ("put", "publicaciones/999/voto", {"votante": str(uuid4()), "valor": 1}),
        ("put", "comentarios/999/voto", {"votante": str(uuid4()), "valor": 1}),
    ],
)
def test_responde_404_si_el_elemento_no_existe(bd_limpia, client, metodo, ruta, cuerpo):
    respuesta = client.request(metodo, f"{FORO}/{ruta}", json=cuerpo)

    assert respuesta.status_code == 404
