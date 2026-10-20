"""crea el foro de la comunidad

Revision ID: 52d1980b8a68
Revises: b270a230d569
Create Date: 2026-10-20 13:43:18.257516

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "52d1980b8a68"
down_revision: str | None = "b270a230d569"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Los Enum se guardan como VARCHAR; su CHECK se declara explícitamente con nombre convencional.
    op.create_table(
        "publicaciones_foro",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "categoria",
            sa.Enum(
                "general",
                "museo",
                "salidas",
                "historias",
                "preguntas",
                name="categoria_foro",
                native_enum=False,
                create_constraint=False,
                length=30,
            ),
            nullable=False,
        ),
        sa.Column("titulo", sa.String(length=200), nullable=False),
        sa.Column("contenido", sa.Text(), nullable=False),
        sa.Column("autor", sa.String(length=60), nullable=False),
        sa.Column("puntaje", sa.Integer(), server_default="0", nullable=False),
        sa.Column("comentarios", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "categoria IN ('general', 'museo', 'salidas', 'historias', 'preguntas')",
            name=op.f("ck_publicaciones_foro_categoria_foro"),
        ),
        sa.CheckConstraint(
            "comentarios >= 0", name=op.f("ck_publicaciones_foro_comentarios_no_negativos")
        ),
        sa.CheckConstraint(
            "length(btrim(autor)) > 0", name=op.f("ck_publicaciones_foro_autor_no_vacio")
        ),
        sa.CheckConstraint(
            "length(btrim(contenido)) > 0", name=op.f("ck_publicaciones_foro_contenido_no_vacio")
        ),
        sa.CheckConstraint(
            "length(btrim(titulo)) > 0", name=op.f("ck_publicaciones_foro_titulo_no_vacio")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_publicaciones_foro")),
    )
    op.create_index(
        "ix_publicaciones_foro_categoria_creado_en",
        "publicaciones_foro",
        ["categoria", "creado_en"],
        unique=False,
    )
    op.create_table(
        "comentarios_foro",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("publicacion_id", sa.Integer(), nullable=False),
        sa.Column("padre_id", sa.Integer(), nullable=True),
        sa.Column("contenido", sa.Text(), nullable=False),
        sa.Column("autor", sa.String(length=60), nullable=False),
        sa.Column("puntaje", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "creado_en", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "length(btrim(autor)) > 0", name=op.f("ck_comentarios_foro_autor_no_vacio")
        ),
        sa.CheckConstraint(
            "length(btrim(contenido)) > 0", name=op.f("ck_comentarios_foro_contenido_no_vacio")
        ),
        sa.ForeignKeyConstraint(
            ["padre_id"],
            ["comentarios_foro.id"],
            name=op.f("fk_comentarios_foro_padre_id_comentarios_foro"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["publicacion_id"],
            ["publicaciones_foro.id"],
            name=op.f("fk_comentarios_foro_publicacion_id_publicaciones_foro"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_comentarios_foro")),
    )
    op.create_index(
        op.f("ix_comentarios_foro_padre_id"), "comentarios_foro", ["padre_id"], unique=False
    )
    op.create_index(
        op.f("ix_comentarios_foro_publicacion_id"),
        "comentarios_foro",
        ["publicacion_id"],
        unique=False,
    )
    op.create_table(
        "votos_publicaciones",
        sa.Column("publicacion_id", sa.Integer(), nullable=False),
        sa.Column("votante", sa.Uuid(), nullable=False),
        sa.Column("valor", sa.SmallInteger(), nullable=False),
        sa.CheckConstraint("valor IN (-1, 1)", name=op.f("ck_votos_publicaciones_valor_valido")),
        sa.ForeignKeyConstraint(
            ["publicacion_id"],
            ["publicaciones_foro.id"],
            name=op.f("fk_votos_publicaciones_publicacion_id_publicaciones_foro"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("publicacion_id", "votante", name=op.f("pk_votos_publicaciones")),
    )
    op.create_table(
        "votos_comentarios",
        sa.Column("comentario_id", sa.Integer(), nullable=False),
        sa.Column("votante", sa.Uuid(), nullable=False),
        sa.Column("valor", sa.SmallInteger(), nullable=False),
        sa.CheckConstraint("valor IN (-1, 1)", name=op.f("ck_votos_comentarios_valor_valido")),
        sa.ForeignKeyConstraint(
            ["comentario_id"],
            ["comentarios_foro.id"],
            name=op.f("fk_votos_comentarios_comentario_id_comentarios_foro"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("comentario_id", "votante", name=op.f("pk_votos_comentarios")),
    )


def downgrade() -> None:
    op.drop_table("votos_comentarios")
    op.drop_table("votos_publicaciones")
    op.drop_index(op.f("ix_comentarios_foro_publicacion_id"), table_name="comentarios_foro")
    op.drop_index(op.f("ix_comentarios_foro_padre_id"), table_name="comentarios_foro")
    op.drop_table("comentarios_foro")
    op.drop_index("ix_publicaciones_foro_categoria_creado_en", table_name="publicaciones_foro")
    op.drop_table("publicaciones_foro")
