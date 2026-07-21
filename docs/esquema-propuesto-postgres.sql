-- =============================================================================
-- Portal Municipal La Molina — PostgreSQL
-- Pegar completo en DBeaver y ejecutar como script (Alt+X)
-- Sin CHECK: los valores cerrados van en tablas catálogo + FK
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Si ya lo corriste antes y quieres recrear todo, descomenta:
-- DROP SCHEMA IF EXISTS institucional CASCADE;
-- DROP SCHEMA IF EXISTS servicios CASCADE;
-- DROP SCHEMA IF EXISTS tramites CASCADE;
-- DROP SCHEMA IF EXISTS portal CASCADE;
-- DROP SCHEMA IF EXISTS medios CASCADE;
-- DROP SCHEMA IF EXISTS seguridad CASCADE;

CREATE SCHEMA IF NOT EXISTS seguridad;
CREATE SCHEMA IF NOT EXISTS medios;
CREATE SCHEMA IF NOT EXISTS portal;
CREATE SCHEMA IF NOT EXISTS tramites;
CREATE SCHEMA IF NOT EXISTS servicios;
CREATE SCHEMA IF NOT EXISTS institucional;

-- =============================================================================
-- seguridad — catálogos
-- =============================================================================

CREATE TABLE seguridad.rol (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE seguridad.seccion_cms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo      VARCHAR(50)  NOT NULL UNIQUE,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  orden       INTEGER      NOT NULL DEFAULT 0
);

INSERT INTO seguridad.rol (codigo, nombre) VALUES
  ('admin',  'Administrador'),
  ('editor', 'Editor');

INSERT INTO seguridad.seccion_cms (codigo, nombre, orden) VALUES
  ('home',               'Inicio',                              1),
  ('noticias',           'Noticias',                            2),
  ('contacto',           'Contáctanos',                         3),
  ('tramites',           'Trámites Municipales',                4),
  ('talleres',           'Talleres',                            5),
  ('muniservicios',      'Muniservicios',                       6),
  ('gestion-municipal',  'Gestión Municipal',                   7),
  ('integridad',         'Integridad Institucional',            8),
  ('normas-legales',     'Normas Legales y Publicaciones',      9),
  ('molina-tv',          'La Molina TV',                       10),
  ('gobierno-digital',   'Gobierno Digital',                   11),
  ('control-interno',    'Sistema de Control Interno',         12),
  ('nav-global',         'Navegación y enlaces globales',      13);

CREATE TABLE seguridad.usuario (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_usuario  VARCHAR(80)  NOT NULL UNIQUE,
  nombre_mostrar  VARCHAR(150) NOT NULL,
  correo          VARCHAR(200) NOT NULL UNIQUE,
  rol_id          UUID         NOT NULL REFERENCES seguridad.rol(id),
  hash_contrasena TEXT         NOT NULL,
  activo          BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE seguridad.usuario_seccion (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES seguridad.usuario(id) ON DELETE CASCADE,
  seccion_cms_id UUID NOT NULL REFERENCES seguridad.seccion_cms(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, seccion_cms_id)
);

-- =============================================================================
-- medios — catálogos
-- =============================================================================

CREATE TABLE medios.tipo_archivo (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO medios.tipo_archivo (codigo, nombre) VALUES
  ('imagen',    'Imagen'),
  ('documento', 'Documento');

CREATE TABLE medios.archivo (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_original   VARCHAR(255) NOT NULL,
  nombre_almacenado VARCHAR(255) NOT NULL,
  ruta              TEXT         NOT NULL,
  tipo_mime         VARCHAR(100) NOT NULL,
  tamano_bytes      BIGINT       NOT NULL,
  tipo_archivo_id   UUID         NOT NULL REFERENCES medios.tipo_archivo(id),
  subido_por        UUID         REFERENCES seguridad.usuario(id) ON DELETE SET NULL,
  creado_en         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- =============================================================================
-- portal — catálogos
-- =============================================================================

CREATE TABLE portal.color_acceso (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE portal.categoria_acceso (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE portal.categoria_noticia (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO portal.color_acceso (codigo, nombre) VALUES
  ('deep',  'Institucional'),
  ('green', 'Trámites digitales'),
  ('slate', 'Control / información');

INSERT INTO portal.categoria_acceso (codigo, nombre) VALUES
  ('digital',       'Digital'),
  ('transparencia', 'Transparencia'),
  ('ciudadano',     'Ciudadano');

INSERT INTO portal.categoria_noticia (codigo, nombre) VALUES
  ('obras',     'Obras'),
  ('cultura',   'Cultura'),
  ('seguridad', 'Seguridad'),
  ('deportes',  'Deportes'),
  ('general',   'General');

CREATE TABLE portal.diapositiva_hero (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo                 VARCHAR(300) NOT NULL,
  subtitulo              TEXT,
  url_imagen             TEXT         NOT NULL,
  etiqueta_boton         VARCHAR(120),
  enlace_boton           TEXT,
  abrir_en_nueva_pestana BOOLEAN      NOT NULL DEFAULT FALSE,
  orden                  INTEGER      NOT NULL DEFAULT 0,
  activo                 BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en              TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE portal.aviso_ticker (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto          VARCHAR(500) NOT NULL,
  enlace         TEXT,
  orden          INTEGER      NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE portal.acceso_rapido (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta               VARCHAR(150) NOT NULL,
  etiqueta_corta         VARCHAR(80),
  enlace                 TEXT         NOT NULL,
  icono                  VARCHAR(80)  NOT NULL,
  color_acceso_id        UUID         NOT NULL REFERENCES portal.color_acceso(id),
  categoria_acceso_id    UUID         NOT NULL REFERENCES portal.categoria_acceso(id),
  destacado              BOOLEAN      NOT NULL DEFAULT FALSE,
  abrir_en_nueva_pestana BOOLEAN      NOT NULL DEFAULT FALSE,
  externo                BOOLEAN      NOT NULL DEFAULT FALSE,
  orden                  INTEGER      NOT NULL DEFAULT 0,
  activo                 BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en              TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE portal.autoridad (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         VARCHAR(200) NOT NULL,
  cargo          VARCHAR(200) NOT NULL,
  departamento   VARCHAR(200) NOT NULL,
  url_imagen     TEXT,
  biografia      TEXT,
  orden          INTEGER      NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE portal.noticia (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo               VARCHAR(300) NOT NULL,
  resumen              TEXT         NOT NULL,
  categoria_noticia_id UUID         NOT NULL REFERENCES portal.categoria_noticia(id),
  publicado_en         TIMESTAMPTZ  NOT NULL,
  url_imagen           TEXT,
  slug                 VARCHAR(200) NOT NULL UNIQUE,
  cuerpo               TEXT,
  enlace_externo       TEXT,
  activo               BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE portal.contacto_municipal (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direccion          TEXT NOT NULL,
  telefono_principal VARCHAR(50),
  horario_semana     VARCHAR(200),
  horario_sabado     VARCHAR(200),
  horario_resumen    VARCHAR(200),
  nota_horario       TEXT,
  url_portal_usuario TEXT,
  url_sobre_nosotros TEXT,
  mapa_latitud       NUMERIC(10, 7),
  mapa_longitud      NUMERIC(10, 7),
  mapa_zoom          INTEGER,
  actualizado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE portal.telefono_atencion (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta VARCHAR(120) NOT NULL,
  numero   VARCHAR(50)  NOT NULL,
  orden    INTEGER      NOT NULL DEFAULT 0,
  activo   BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE portal.enlace_social (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta VARCHAR(80) NOT NULL,
  enlace   TEXT        NOT NULL,
  orden    INTEGER     NOT NULL DEFAULT 0,
  activo   BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE portal.item_navegacion (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etiqueta               VARCHAR(120) NOT NULL,
  enlace                 TEXT         NOT NULL,
  abrir_en_nueva_pestana BOOLEAN      NOT NULL DEFAULT FALSE,
  externo                BOOLEAN      NOT NULL DEFAULT FALSE,
  orden                  INTEGER      NOT NULL DEFAULT 0,
  activo                 BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE portal.item_navegacion_hijo (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_navegacion_id UUID         NOT NULL REFERENCES portal.item_navegacion(id) ON DELETE CASCADE,
  etiqueta           VARCHAR(120) NOT NULL,
  enlace             TEXT         NOT NULL,
  descripcion        TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0,
  activo             BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE portal.enlace_externo (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo         VARCHAR(80)  NOT NULL UNIQUE,
  etiqueta       VARCHAR(150) NOT NULL,
  enlace         TEXT         NOT NULL,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- =============================================================================
-- tramites — catálogos
-- =============================================================================

CREATE TABLE tramites.categoria_tramite (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(80)  NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL
);

CREATE TABLE tramites.tipo_canal (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO tramites.categoria_tramite (codigo, nombre) VALUES
  ('vecinos',                   'Vecinos'),
  ('negocios',                  'Negocios'),
  ('registro-civil',            'Registro Civil'),
  ('licencias-de-edificacion',  'Licencias de Edificación'),
  ('tupa',                      'TUPA');

INSERT INTO tramites.tipo_canal (codigo, nombre) VALUES
  ('virtual',       'Virtual'),
  ('presencial',    'Presencial'),
  ('web',           'Web'),
  ('telefonico',    'Telefónico'),
  ('100-en-linea',  '100% en línea');

CREATE TABLE tramites.tramite (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(200) NOT NULL UNIQUE,
  titulo          VARCHAR(300) NOT NULL,
  resumen         TEXT         NOT NULL,
  dirigido_a      TEXT,
  cuando          TEXT,
  duracion        VARCHAR(200),
  costo           VARCHAR(200),
  resultado       TEXT,
  vigencia        VARCHAR(200),
  accion_etiqueta VARCHAR(150),
  accion_enlace   TEXT,
  orden           INTEGER      NOT NULL DEFAULT 0,
  activo          BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE tramites.tramite_categoria (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id           UUID NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  categoria_tramite_id UUID NOT NULL REFERENCES tramites.categoria_tramite(id),
  UNIQUE (tramite_id, categoria_tramite_id)
);

CREATE TABLE tramites.tramite_canal (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id   UUID NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  tipo_canal_id UUID NOT NULL REFERENCES tramites.tipo_canal(id),
  descripcion  TEXT NOT NULL,
  horario      VARCHAR(200),
  orden        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_requisito (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id UUID    NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  texto      TEXT    NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_documento (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id UUID    NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  texto      TEXT    NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_tarifa (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id UUID         NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  concepto   VARCHAR(300) NOT NULL,
  monto      VARCHAR(100) NOT NULL,
  orden      INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_pregunta_frecuente (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id UUID    NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  pregunta   TEXT    NOT NULL,
  respuesta  TEXT    NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_base_legal (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id UUID    NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  texto      TEXT    NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tramites.tramite_descarga (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tramite_id   UUID         NOT NULL REFERENCES tramites.tramite(id) ON DELETE CASCADE,
  etiqueta     VARCHAR(200) NOT NULL,
  enlace       TEXT         NOT NULL,
  tipo_archivo VARCHAR(20),
  url_origen   TEXT,
  orden        INTEGER      NOT NULL DEFAULT 0,
  activo       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE tramites.periodo_tupa (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anio      INTEGER     NOT NULL UNIQUE,
  activo    BOOLEAN     NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tramites.documento_tupa (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo_tupa_id UUID         NOT NULL REFERENCES tramites.periodo_tupa(id) ON DELETE CASCADE,
  orden           INTEGER      NOT NULL DEFAULT 0,
  titulo          VARCHAR(400) NOT NULL,
  descripcion     TEXT,
  enlace          TEXT,
  tipo_archivo    VARCHAR(20),
  fuente_emision  VARCHAR(200),
  activo          BOOLEAN      NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- servicios — catálogos
-- =============================================================================

CREATE TABLE servicios.tipo_icono (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE servicios.tipo_enlace_gobierno_digital (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO servicios.tipo_icono (codigo, nombre) VALUES
  ('svg', 'SVG'),
  ('fa',  'Font Awesome');

INSERT INTO servicios.tipo_enlace_gobierno_digital (codigo, nombre) VALUES
  ('servicio',    'Servicio'),
  ('aplicacion',  'Aplicación');

CREATE TABLE servicios.categoria_servicio (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           VARCHAR(200) NOT NULL UNIQUE,
  titulo         VARCHAR(300) NOT NULL,
  titulo_corto   VARCHAR(150),
  resumen        TEXT,
  url_imagen     TEXT,
  mision         TEXT,
  vision         TEXT,
  orden          INTEGER      NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE servicios.servicio_municipal (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_servicio_id UUID         NOT NULL REFERENCES servicios.categoria_servicio(id) ON DELETE CASCADE,
  slug                  VARCHAR(200) NOT NULL,
  titulo                VARCHAR(300) NOT NULL,
  resumen               TEXT,
  detalles              TEXT,
  publico_objetivo      TEXT,
  disponibilidad        TEXT,
  contacto              TEXT,
  accion_etiqueta       VARCHAR(150),
  accion_enlace         TEXT,
  accion_externa        BOOLEAN      NOT NULL DEFAULT FALSE,
  url_icono             TEXT,
  cuerpo                TEXT,
  orden                 INTEGER      NOT NULL DEFAULT 0,
  activo                BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (categoria_servicio_id, slug)
);

CREATE TABLE servicios.categoria_taller (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           VARCHAR(200) NOT NULL UNIQUE,
  titulo         VARCHAR(300) NOT NULL,
  titulo_pagina  VARCHAR(300),
  migas_pan      VARCHAR(300),
  url_origen     TEXT,
  tipo_icono_id  UUID REFERENCES servicios.tipo_icono(id),
  icono_valor    TEXT,
  aviso          TEXT,
  orden          INTEGER      NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE servicios.imagen_taller (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_taller_id UUID         NOT NULL REFERENCES servicios.categoria_taller(id) ON DELETE CASCADE,
  url                 TEXT         NOT NULL,
  url_origen          TEXT,
  texto_alternativo   VARCHAR(300),
  titulo              VARCHAR(300),
  orden               INTEGER      NOT NULL DEFAULT 0,
  activo              BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE servicios.config_gobierno_digital (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_gobierno_digital TEXT,
  actualizado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE servicios.enlace_gobierno_digital (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_enlace_gobierno_digital_id UUID         NOT NULL REFERENCES servicios.tipo_enlace_gobierno_digital(id),
  etiqueta                        VARCHAR(200) NOT NULL,
  enlace                          TEXT         NOT NULL,
  orden                           INTEGER      NOT NULL DEFAULT 0,
  activo                          BOOLEAN      NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- institucional — catálogos
-- =============================================================================

CREATE TABLE institucional.tipo_documento_control (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE institucional.proveedor_video (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(40)  NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO institucional.tipo_documento_control (codigo, nombre) VALUES
  ('plan-de-accion', 'Plan de acción'),
  ('evaluacion',     'Evaluación'),
  ('seguimiento',    'Seguimiento');

INSERT INTO institucional.proveedor_video (codigo, nombre) VALUES
  ('youtube',  'YouTube'),
  ('facebook', 'Facebook'),
  ('live',     'En vivo');

CREATE TABLE institucional.seccion_gestion (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           VARCHAR(200) NOT NULL UNIQUE,
  titulo         VARCHAR(300) NOT NULL,
  resumen        TEXT,
  url_origen     TEXT,
  orden          INTEGER      NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE institucional.parrafo_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID    NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  texto              TEXT    NOT NULL,
  orden              INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE institucional.encabezado_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  texto              VARCHAR(400) NOT NULL,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.imagen_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  url                TEXT         NOT NULL,
  texto_alternativo  VARCHAR(300),
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.documento_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  etiqueta           VARCHAR(300) NOT NULL,
  enlace             TEXT         NOT NULL,
  url_origen         TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.persona_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  cargo              VARCHAR(200) NOT NULL,
  nombre             VARCHAR(200) NOT NULL,
  correo             VARCHAR(200),
  url_foto           TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.comision_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  nombre             VARCHAR(300) NOT NULL,
  descripcion        TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.estructura_organica (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  titulo             VARCHAR(300) NOT NULL,
  descripcion        TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.reconocimiento_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID         NOT NULL REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  titulo             VARCHAR(300) NOT NULL,
  descripcion        TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE institucional.perfil_gestion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_gestion_id UUID NOT NULL UNIQUE REFERENCES institucional.seccion_gestion(id) ON DELETE CASCADE,
  nombre             VARCHAR(200),
  cargo              VARCHAR(200),
  biografia          TEXT,
  url_foto           TEXT
);

CREATE TABLE institucional.tema_integridad (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo           VARCHAR(300) NOT NULL,
  descripcion      TEXT,
  url_imagen       TEXT,
  texto_alt_imagen VARCHAR(300),
  orden            INTEGER      NOT NULL DEFAULT 0,
  activo           BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.documento_integridad (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      VARCHAR(400) NOT NULL,
  fecha       DATE,
  enlace      TEXT         NOT NULL,
  descripcion TEXT,
  orden       INTEGER      NOT NULL DEFAULT 0,
  activo      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.componente_integridad (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      VARCHAR(300) NOT NULL,
  descripcion TEXT,
  orden       INTEGER      NOT NULL DEFAULT 0,
  activo      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.categoria_norma (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo      VARCHAR(80)  NOT NULL UNIQUE,
  titulo      VARCHAR(300) NOT NULL,
  descripcion TEXT,
  enlace      TEXT,
  orden       INTEGER      NOT NULL DEFAULT 0,
  activo      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.documento_norma (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_norma_id UUID         NOT NULL REFERENCES institucional.categoria_norma(id) ON DELETE CASCADE,
  titulo             VARCHAR(400) NOT NULL,
  enlace             TEXT         NOT NULL,
  fecha              DATE,
  orden              INTEGER      NOT NULL DEFAULT 0,
  activo             BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.otra_publicacion (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo      VARCHAR(80)  NOT NULL UNIQUE,
  titulo      VARCHAR(300) NOT NULL,
  fecha       DATE,
  descripcion TEXT,
  enlace      TEXT,
  orden       INTEGER      NOT NULL DEFAULT 0,
  activo      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.documento_otra_publicacion (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otra_publicacion_id UUID         NOT NULL REFERENCES institucional.otra_publicacion(id) ON DELETE CASCADE,
  titulo              VARCHAR(400) NOT NULL,
  enlace              TEXT         NOT NULL,
  fecha               DATE,
  orden               INTEGER      NOT NULL DEFAULT 0,
  activo              BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.periodo_control_interno (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anio   INTEGER NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.documento_control_interno (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo_control_interno_id UUID NOT NULL REFERENCES institucional.periodo_control_interno(id) ON DELETE CASCADE,
  titulo                     VARCHAR(400) NOT NULL,
  enlace                     TEXT         NOT NULL,
  tipo_documento_control_id  UUID         NOT NULL REFERENCES institucional.tipo_documento_control(id),
  orden                      INTEGER      NOT NULL DEFAULT 0,
  activo                     BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.categoria_tv (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       VARCHAR(200) NOT NULL UNIQUE,
  titulo     VARCHAR(300) NOT NULL,
  migas_pan  VARCHAR(300),
  url_origen TEXT,
  orden      INTEGER      NOT NULL DEFAULT 0,
  activo     BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE institucional.video_tv (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_tv_id    UUID         NOT NULL REFERENCES institucional.categoria_tv(id) ON DELETE CASCADE,
  titulo             VARCHAR(400) NOT NULL,
  url                TEXT         NOT NULL,
  youtube_id         VARCHAR(50),
  proveedor_video_id UUID         NOT NULL REFERENCES institucional.proveedor_video(id),
  url_embed          TEXT,
  orden              INTEGER      NOT NULL DEFAULT 0,
  activo             BOOLEAN      NOT NULL DEFAULT TRUE
);

-- =============================================================================
-- índices
-- =============================================================================

CREATE INDEX idx_noticia_publicado_en ON portal.noticia (publicado_en DESC);
CREATE INDEX idx_noticia_categoria ON portal.noticia (categoria_noticia_id);
CREATE INDEX idx_tramite_slug ON tramites.tramite (slug);
CREATE INDEX idx_servicio_categoria ON servicios.servicio_municipal (categoria_servicio_id);
CREATE INDEX idx_archivo_tipo ON medios.archivo (tipo_archivo_id);
