"""crea el modelo de contenido inicial

Revision ID: b270a230d569
Revises:
Create Date: 2026-10-03 20:35:04.206262

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "b270a230d569"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Los Enum se guardan como VARCHAR; su CHECK se declara explícitamente con nombre convencional.
    op.create_table(
        "actividades",
        sa.Column(
            "tipo",
            sa.Enum(
                "salida_pedagogica",
                "fecha_conmemorativa",
                "formacion",
                name="tipo_actividad",
                native_enum=False,
                create_constraint=False,
                length=30,
            ),
            nullable=False,
        ),
        sa.Column("lugar", sa.String(length=200), nullable=True),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.CheckConstraint(
            "tipo IN ('salida_pedagogica', 'fecha_conmemorativa', 'formacion')",
            name=op.f("ck_actividades_tipo_actividad"),
        ),
        sa.CheckConstraint("anio BETWEEN 1900 AND 2100", name=op.f("ck_actividades_anio_valido")),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_actividades_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_actividades_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_actividades_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_actividades_mes_requiere_anio_o_dia"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_actividades")),
        sa.UniqueConstraint("slug", name=op.f("uq_actividades_slug")),
    )
    op.create_index("ix_actividades_tipo_anio", "actividades", ["tipo", "anio"], unique=False)
    op.create_table(
        "aliados",
        sa.Column("tipo", sa.String(length=100), nullable=True),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("logo_url", sa.String(length=500), nullable=True),
        sa.Column("sitio_web", sa.String(length=500), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_aliados")),
        sa.UniqueConstraint("slug", name=op.f("uq_aliados_slug")),
    )
    op.create_table(
        "eventos",
        sa.Column(
            "tipo",
            sa.Enum(
                "visita",
                "evento",
                "medios",
                name="tipo_evento",
                native_enum=False,
                create_constraint=False,
                length=30,
            ),
            nullable=False,
        ),
        sa.Column("lugar", sa.String(length=200), nullable=True),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.CheckConstraint(
            "tipo IN ('visita', 'evento', 'medios')", name=op.f("ck_eventos_tipo_evento")
        ),
        sa.CheckConstraint("anio BETWEEN 1900 AND 2100", name=op.f("ck_eventos_anio_valido")),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_eventos_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_eventos_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_eventos_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_eventos_mes_requiere_anio_o_dia"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_eventos")),
        sa.UniqueConstraint("slug", name=op.f("uq_eventos_slug")),
    )
    op.create_index("ix_eventos_tipo_anio", "eventos", ["tipo", "anio"], unique=False)
    op.create_table(
        "exposiciones",
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("lugar", sa.String(length=200), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.CheckConstraint("anio BETWEEN 1900 AND 2100", name=op.f("ck_exposiciones_anio_valido")),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_exposiciones_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_exposiciones_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_exposiciones_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_exposiciones_mes_requiere_anio_o_dia"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_exposiciones")),
        sa.UniqueConstraint("slug", name=op.f("uq_exposiciones_slug")),
    )
    op.create_table(
        "objetos_museo",
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("importancia_memoria", sa.Text(), nullable=True),
        sa.Column("foto_url", sa.String(length=500), nullable=True),
        sa.Column("modelo_3d_url", sa.String(length=500), nullable=True),
        sa.Column("creditos", sa.String(length=300), nullable=True),
        sa.Column("pos_x", sa.Float(), server_default="0", nullable=False),
        sa.Column("pos_y", sa.Float(), server_default="0", nullable=False),
        sa.Column("pos_z", sa.Float(), server_default="0", nullable=False),
        sa.Column("rot_y", sa.Float(), server_default="0", nullable=False),
        sa.Column("escala", sa.Float(), server_default="1", nullable=False),
        sa.Column("orden", sa.SmallInteger(), server_default="0", nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.CheckConstraint("anio BETWEEN 1900 AND 2100", name=op.f("ck_objetos_museo_anio_valido")),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_objetos_museo_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_objetos_museo_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_objetos_museo_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_objetos_museo_mes_requiere_anio_o_dia"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_objetos_museo")),
        sa.UniqueConstraint("slug", name=op.f("uq_objetos_museo_slug")),
    )
    op.create_table(
        "reconocimientos",
        sa.Column("otorgante", sa.String(length=200), nullable=True),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("nombre", sa.String(length=200), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.CheckConstraint(
            "anio BETWEEN 1900 AND 2100", name=op.f("ck_reconocimientos_anio_valido")
        ),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_reconocimientos_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_reconocimientos_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_reconocimientos_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_reconocimientos_mes_requiere_anio_o_dia"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_reconocimientos")),
        sa.UniqueConstraint("slug", name=op.f("uq_reconocimientos_slug")),
    )
    op.create_table(
        "visitantes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nombre", sa.String(length=120), nullable=False),
        sa.Column("correo", sa.String(length=254), nullable=False),
        sa.Column("institucion", sa.String(length=150), nullable=True),
        sa.Column("rol", sa.String(length=80), nullable=True),
        sa.Column("mensaje", sa.Text(), nullable=True),
        sa.Column(
            "origen",
            sa.Enum(
                "contacto",
                "libro_visitas",
                name="origen_visitante",
                native_enum=False,
                create_constraint=False,
                length=30,
            ),
            nullable=False,
        ),
        sa.Column("consentimiento_datos", sa.Boolean(), nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "origen IN ('contacto', 'libro_visitas')", name=op.f("ck_visitantes_origen_visitante")
        ),
        sa.CheckConstraint(
            "consentimiento_datos", name=op.f("ck_visitantes_consentimiento_obligatorio")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_visitantes")),
    )
    op.create_index(op.f("ix_visitantes_correo"), "visitantes", ["correo"], unique=False)
    op.create_table(
        "evidencias",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "tipo",
            sa.Enum(
                "foto",
                "video",
                "audio",
                "enlace",
                "documento",
                name="tipo_evidencia",
                native_enum=False,
                create_constraint=False,
                length=30,
            ),
            nullable=False,
        ),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("titulo", sa.String(length=200), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("creditos", sa.String(length=300), nullable=True),
        sa.Column("orden", sa.SmallInteger(), server_default="0", nullable=False),
        sa.Column("exposicion_id", sa.Integer(), nullable=True),
        sa.Column("objeto_id", sa.Integer(), nullable=True),
        sa.Column("evento_id", sa.Integer(), nullable=True),
        sa.Column("actividad_id", sa.Integer(), nullable=True),
        sa.Column("reconocimiento_id", sa.Integer(), nullable=True),
        sa.Column("aliado_id", sa.Integer(), nullable=True),
        sa.Column("anio", sa.SmallInteger(), nullable=True),
        sa.Column("mes", sa.SmallInteger(), nullable=True),
        sa.Column("dia", sa.SmallInteger(), nullable=True),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "tipo IN ('foto', 'video', 'audio', 'enlace', 'documento')",
            name=op.f("ck_evidencias_tipo_evidencia"),
        ),
        sa.CheckConstraint("anio BETWEEN 1900 AND 2100", name=op.f("ck_evidencias_anio_valido")),
        sa.CheckConstraint("dia BETWEEN 1 AND 31", name=op.f("ck_evidencias_dia_valido")),
        sa.CheckConstraint(
            "dia IS NULL OR mes IS NOT NULL", name=op.f("ck_evidencias_dia_requiere_mes")
        ),
        sa.CheckConstraint("mes BETWEEN 1 AND 12", name=op.f("ck_evidencias_mes_valido")),
        sa.CheckConstraint(
            "mes IS NULL OR anio IS NOT NULL OR dia IS NOT NULL",
            name=op.f("ck_evidencias_mes_requiere_anio_o_dia"),
        ),
        sa.CheckConstraint(
            "num_nonnulls(exposicion_id, objeto_id, evento_id, actividad_id, reconocimiento_id, aliado_id) <= 1",
            name=op.f("ck_evidencias_un_padre"),
        ),
        sa.ForeignKeyConstraint(
            ["actividad_id"],
            ["actividades.id"],
            name=op.f("fk_evidencias_actividad_id_actividades"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["aliado_id"],
            ["aliados.id"],
            name=op.f("fk_evidencias_aliado_id_aliados"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["evento_id"],
            ["eventos.id"],
            name=op.f("fk_evidencias_evento_id_eventos"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["exposicion_id"],
            ["exposiciones.id"],
            name=op.f("fk_evidencias_exposicion_id_exposiciones"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["objeto_id"],
            ["objetos_museo.id"],
            name=op.f("fk_evidencias_objeto_id_objetos_museo"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["reconocimiento_id"],
            ["reconocimientos.id"],
            name=op.f("fk_evidencias_reconocimiento_id_reconocimientos"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_evidencias")),
    )
    op.create_index(
        op.f("ix_evidencias_actividad_id"), "evidencias", ["actividad_id"], unique=False
    )
    op.create_index(op.f("ix_evidencias_aliado_id"), "evidencias", ["aliado_id"], unique=False)
    op.create_index(op.f("ix_evidencias_evento_id"), "evidencias", ["evento_id"], unique=False)
    op.create_index(
        op.f("ix_evidencias_exposicion_id"), "evidencias", ["exposicion_id"], unique=False
    )
    op.create_index(op.f("ix_evidencias_objeto_id"), "evidencias", ["objeto_id"], unique=False)
    op.create_index(
        op.f("ix_evidencias_reconocimiento_id"), "evidencias", ["reconocimiento_id"], unique=False
    )
    op.create_table(
        "objeto_exposicion",
        sa.Column("objeto_id", sa.Integer(), nullable=False),
        sa.Column("exposicion_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["exposicion_id"],
            ["exposiciones.id"],
            name=op.f("fk_objeto_exposicion_exposicion_id_exposiciones"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["objeto_id"],
            ["objetos_museo.id"],
            name=op.f("fk_objeto_exposicion_objeto_id_objetos_museo"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("objeto_id", "exposicion_id", name=op.f("pk_objeto_exposicion")),
    )
    op.create_index(
        op.f("ix_objeto_exposicion_exposicion_id"),
        "objeto_exposicion",
        ["exposicion_id"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_objeto_exposicion_exposicion_id"), table_name="objeto_exposicion")
    op.drop_table("objeto_exposicion")
    op.drop_index(op.f("ix_evidencias_reconocimiento_id"), table_name="evidencias")
    op.drop_index(op.f("ix_evidencias_objeto_id"), table_name="evidencias")
    op.drop_index(op.f("ix_evidencias_exposicion_id"), table_name="evidencias")
    op.drop_index(op.f("ix_evidencias_evento_id"), table_name="evidencias")
    op.drop_index(op.f("ix_evidencias_aliado_id"), table_name="evidencias")
    op.drop_index(op.f("ix_evidencias_actividad_id"), table_name="evidencias")
    op.drop_table("evidencias")
    op.drop_index(op.f("ix_visitantes_correo"), table_name="visitantes")
    op.drop_table("visitantes")
    op.drop_table("reconocimientos")
    op.drop_table("objetos_museo")
    op.drop_table("exposiciones")
    op.drop_index("ix_eventos_tipo_anio", table_name="eventos")
    op.drop_table("eventos")
    op.drop_table("aliados")
    op.drop_index("ix_actividades_tipo_anio", table_name="actividades")
    op.drop_table("actividades")
    # ### end Alembic commands ###
