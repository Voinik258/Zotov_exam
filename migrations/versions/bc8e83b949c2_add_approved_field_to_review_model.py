"""Add approved field to Review model

Revision ID: bc8e83b949c2
Revises: e974d6ef3fd8
Create Date: 2025-11-17 02:49:07.767969

"""
from alembic import op
import sqlalchemy as sa


# идентификаторы ревизии, используемые Alembic.
revision = 'bc8e83b949c2'
down_revision = 'e974d6ef3fd8'
branch_labels = None
depends_on = None


def upgrade():
    # ### команды автоматически сгенерированы Alembic - пожалуйста, скорректируйте! ###
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('approved', sa.Boolean(), nullable=True))

    # ### конец команд Alembic ###


def downgrade():
    # ### команды автоматически сгенерированы Alembic - пожалуйста, скорректируйте! ###
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.drop_column('approved')

    # ### конец команд Alembic ###
