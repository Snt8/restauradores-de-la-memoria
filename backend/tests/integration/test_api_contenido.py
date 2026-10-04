import pytest

from seeds.cargador import cargar
from tests.datos import contenido, foto

pytestmark = pytest.mark.integration


@pytest.fixture
async def datos(sesion):
    await cargar(
        sesion,
        contenido(
            exposiciones=[
                {
                    "slug": "museo-2025",
                    "nombre": "Museo 2025",
                    "fecha": {"anio": 2025, "mes": 11},
                    "evidencias": [foto("media/museo/a", "Altar")],
                }
            ],
            objetos=[
                {
                    "slug": "pieza",
                    "nombre": "Pieza",
                    "descripcion": "Descripción",
                    "modelo_3d_url": "models/pieza.glb",
                    "ubicacion": {"x": -2, "y": 1},
                    "exposiciones": ["museo-2025"],
                }
            ],
            eventos=[
                {"slug": "radio", "nombre": "Radio", "tipo": "medios", "fecha": {"anio": 2025}},
                {"slug": "festival", "nombre": "Festival", "tipo": "evento"},
            ],
            actividades=[
                {
                    "slug": "abril",
                    "nombre": "9 de abril",
                    "tipo": "fecha_conmemorativa",
                    "fecha": {"mes": 4, "dia": 9},
                }
            ],
            reconocimientos=[{"slug": "premio", "nombre": "Premio", "otorgante": "SED"}],
            aliados=[{"slug": "cnmh", "nombre": "CNMH", "logo_url": "media/aliados/logo"}],
        ),
    )
    await sesion.commit()


@pytest.mark.parametrize(
    ("ruta", "total"),
    [
        ("exposiciones", 1),
        ("objetos", 1),
        ("eventos", 2),
        ("actividades", 1),
        ("reconocimientos", 1),
        ("aliados", 1),
        ("galeria", 1),
    ],
)
def test_cada_coleccion_responde_paginada(datos, client, ruta, total):
    respuesta = client.get(f"/api/v1/{ruta}")

    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["total"] == total
    assert (cuerpo["limite"], cuerpo["desplazamiento"]) == (50, 0)
    assert len(cuerpo["elementos"]) == total


def test_el_detalle_del_objeto_trae_todo_lo_que_necesita_el_museo_virtual(datos, client):
    respuesta = client.get("/api/v1/objetos/pieza")

    assert respuesta.status_code == 200
    objeto = respuesta.json()
    assert objeto["modelo_3d_url"] == "models/pieza.glb"
    assert objeto["ubicacion"] == {"x": -2, "y": 1, "z": 0, "rotacion_y": 0, "escala": 1}
    assert objeto["exposiciones"] == [{"slug": "museo-2025", "nombre": "Museo 2025"}]
    assert objeto["fecha"] == {"anio": None, "mes": None, "dia": None}


def test_filtra_eventos_por_tipo(datos, client):
    cuerpo = client.get("/api/v1/eventos", params={"tipo": "medios"}).json()

    assert [e["slug"] for e in cuerpo["elementos"]] == ["radio"]


def test_la_galeria_incluye_seccion_y_contexto(datos, client):
    (elemento,) = client.get("/api/v1/galeria", params={"seccion": "museo"}).json()["elementos"]

    assert elemento["seccion"] == "museo"
    assert elemento["contexto"] == "Museo 2025"
    assert elemento["evidencia"]["titulo"] == "Altar"


def test_responde_404_con_un_mensaje_claro(datos, client):
    respuesta = client.get("/api/v1/eventos/no-existe")

    assert respuesta.status_code == 404
    assert "no-existe" in respuesta.json()["detail"]


@pytest.mark.parametrize(
    "consulta",
    [
        {"tipo": "fiesta"},
        {"anio": 1500},
        {"limite": 101},
        {"limite": 0},
        {"desplazamiento": -1},
    ],
)
def test_rechaza_parametros_invalidos(bd_limpia, client, consulta):
    assert client.get("/api/v1/eventos", params=consulta).status_code == 422


def test_la_galeria_no_tiene_vista_de_detalle(bd_limpia, client):
    assert client.get("/api/v1/galeria/algo").status_code in {404, 405}
