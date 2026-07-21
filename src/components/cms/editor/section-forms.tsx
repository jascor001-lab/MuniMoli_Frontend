"use client";

import { useState } from "react";
import type { CmsSectionId } from "@/lib/cms/permissions";
import {
  EditorCard,
  SectionTabs,
  SelectField,
  TextArea,
  TextInput,
  ToggleField,
} from "./fields";
import { MediaUpload } from "./media-upload";
import { ListEditor, StringListEditor } from "./list-editor";

type Props = {
  sectionId: CmsSectionId;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function VisualSectionForm({ sectionId, data, onChange }: Props) {
  switch (sectionId) {
    case "home":
      return <HomeForm data={data} onChange={onChange} />;
    case "noticias":
      return <NoticiasForm data={data} onChange={onChange} />;
    case "contacto":
      return <ContactoForm data={data} onChange={onChange} />;
    case "gobierno-digital":
      return <GobiernoDigitalForm data={data} onChange={onChange} />;
    case "integridad":
      return <IntegridadForm data={data} onChange={onChange} />;
    case "normas-legales":
      return <NormasForm data={data} onChange={onChange} />;
    case "nav-global":
      return <NavForm data={data} onChange={onChange} />;
    case "control-interno":
      return <ControlInternoForm data={data} onChange={onChange} />;
    case "molina-tv":
      return <MolinaTvForm data={data} onChange={onChange} />;
    case "talleres":
      return <TalleresForm data={data} onChange={onChange} />;
    case "tramites":
      return <TramitesForm data={data} onChange={onChange} />;
    case "muniservicios":
      return <MuniserviciosForm data={data} onChange={onChange} />;
    case "gestion-municipal":
      return <GestionForm data={data} onChange={onChange} />;
    default:
      return (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Esta sección aún no tiene formulario visual.
        </p>
      );
  }
}

function HomeForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [tab, setTab] = useState("hero");
  const heroSlides = asArray<Record<string, unknown>>(data.heroSlides);
  const tickerItems = asArray<Record<string, unknown>>(data.tickerItems);
  const quickAccess = asArray<Record<string, unknown>>(data.quickAccess);
  const authorities = asArray<Record<string, unknown>>(data.authorities);

  return (
    <div className="space-y-4">
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "hero", label: "Carrusel", count: heroSlides.length },
          { id: "ticker", label: "Avisos", count: tickerItems.length },
          { id: "accesos", label: "Accesos rápidos", count: quickAccess.length },
          { id: "autoridades", label: "Autoridades", count: authorities.length },
        ]}
      />

      {tab === "hero" ? (
        <ListEditor
          title="Carrusel de inicio"
          description="Imágenes grandes de la portada. Puedes subir una foto nueva."
          items={heroSlides}
          onChange={(items) => onChange({ ...data, heroSlides: items })}
          createItem={() => ({
            id: uid("slide"),
            title: "Nuevo título",
            subtitle: "",
            imageUrl: "",
            ctaLabel: "Ver más",
            ctaHref: "/",
            ctaOpenInNewTab: false,
          })}
          getTitle={(item) => String(item.title || "Sin título")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => update({ title })}
              />
              <TextArea
                label="Subtítulo"
                value={String(item.subtitle || "")}
                onChange={(subtitle) => update({ subtitle })}
              />
              <MediaUpload
                label="Imagen del carrusel"
                accept="image"
                value={String(item.imageUrl || "")}
                onChange={(imageUrl) => update({ imageUrl })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  label="Texto del botón"
                  value={String(item.ctaLabel || "")}
                  onChange={(ctaLabel) => update({ ctaLabel })}
                />
                <TextInput
                  label="Enlace del botón"
                  value={String(item.ctaHref || "")}
                  onChange={(ctaHref) => update({ ctaHref })}
                />
              </div>
              <ToggleField
                label="Abrir enlace en pestaña nueva"
                checked={Boolean(item.ctaOpenInNewTab)}
                onChange={(ctaOpenInNewTab) => update({ ctaOpenInNewTab })}
              />
            </>
          )}
        />
      ) : null}

      {tab === "ticker" ? (
        <ListEditor
          title="Cinta de avisos"
          description="Mensajes que se desplazan bajo el carrusel."
          items={tickerItems}
          onChange={(items) => onChange({ ...data, tickerItems: items })}
          createItem={() => ({
            id: uid("ticker"),
            text: "Nuevo aviso",
            href: "/noticias",
          })}
          getTitle={(item) => String(item.text || "Aviso")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Texto del aviso"
                value={String(item.text || "")}
                onChange={(text) => update({ text })}
              />
              <TextInput
                label="Enlace"
                value={String(item.href || "")}
                onChange={(href) => update({ href })}
              />
            </>
          )}
        />
      ) : null}

      {tab === "accesos" ? (
        <ListEditor
          title="Accesos rápidos"
          description="Botones de servicios en la portada."
          items={quickAccess}
          onChange={(items) => onChange({ ...data, quickAccess: items })}
          createItem={() => ({
            id: uid("acceso"),
            label: "Nuevo acceso",
            href: "/",
            icon: "link",
            color: "deep",
            category: "ciudadano",
          })}
          getTitle={(item) => String(item.label || "Acceso")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Nombre"
                value={String(item.label || "")}
                onChange={(label) => update({ label })}
              />
              <TextInput
                label="Enlace"
                value={String(item.href || "")}
                onChange={(href) => update({ href })}
              />
              <SelectField
                label="Color"
                value={String(item.color || "deep")}
                onChange={(color) => update({ color })}
                options={[
                  { value: "deep", label: "Institucional" },
                  { value: "green", label: "Verde" },
                  { value: "slate", label: "Gris" },
                ]}
              />
            </>
          )}
        />
      ) : null}

      {tab === "autoridades" ? (
        <ListEditor
          title="Autoridades"
          description="Fotos y cargos destacados (ej. alcalde)."
          items={authorities}
          onChange={(items) => onChange({ ...data, authorities: items })}
          createItem={() => ({
            id: uid("auth"),
            name: "Nombre",
            role: "Cargo",
            department: "",
            imageUrl: "",
            bio: "",
          })}
          getTitle={(item) => String(item.name || "Autoridad")}
          renderItem={(item, _i, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  label="Nombre"
                  value={String(item.name || "")}
                  onChange={(name) => update({ name })}
                />
                <TextInput
                  label="Cargo"
                  value={String(item.role || "")}
                  onChange={(role) => update({ role })}
                />
              </div>
              <TextInput
                label="Área / departamento"
                value={String(item.department || "")}
                onChange={(department) => update({ department })}
              />
              <MediaUpload
                label="Foto"
                accept="image"
                value={String(item.imageUrl || "")}
                onChange={(imageUrl) => update({ imageUrl })}
              />
              <TextArea
                label="Biografía corta"
                value={String(item.bio || "")}
                onChange={(bio) => update({ bio })}
              />
            </>
          )}
        />
      ) : null}
    </div>
  );
}

function NoticiasForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const items = asArray<Record<string, unknown>>(data.items);
  return (
    <ListEditor
      title="Noticias del portal"
      description="Publica, edita o elimina noticias. Sube la imagen de portada."
      items={items}
      onChange={(next) => onChange({ ...data, items: next })}
      createItem={() => {
        const title = "Nueva noticia";
        return {
          id: uid("news"),
          title,
          excerpt: "",
          category: "General",
          publishedAt: new Date().toISOString().slice(0, 10),
          imageUrl: "",
          slug: slugify(title),
          href: "",
        };
      }}
      getTitle={(item) => String(item.title || "Sin título")}
      renderItem={(item, _i, update) => (
        <>
          <TextInput
            label="Título"
            value={String(item.title || "")}
            onChange={(title) =>
              update({
                title,
                slug: item.slug ? String(item.slug) : slugify(title),
              })
            }
          />
          <TextArea
            label="Resumen"
            value={String(item.excerpt || "")}
            onChange={(excerpt) => update({ excerpt })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Categoría"
              value={String(item.category || "General")}
              onChange={(category) => update({ category })}
              options={[
                "Obras",
                "Cultura",
                "Seguridad",
                "Deportes",
                "General",
              ].map((v) => ({ value: v, label: v }))}
            />
            <TextInput
              label="Fecha"
              type="date"
              value={String(item.publishedAt || "").slice(0, 10)}
              onChange={(publishedAt) => update({ publishedAt })}
            />
          </div>
          <MediaUpload
            label="Imagen de la noticia"
            accept="image"
            value={String(item.imageUrl || "")}
            onChange={(imageUrl) => update({ imageUrl })}
          />
          <TextArea
            label="Contenido completo"
            hint="Texto de la nota que se muestra en /noticias/[slug]"
            rows={8}
            value={String(item.body || item.excerpt || "")}
            onChange={(body) => update({ body })}
          />
        </>
      )}
    />
  );
}

function ContactoForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const contact = asRecord(data.contact);
  const phones = asArray<Record<string, unknown>>(data.phones);
  const socialLinks = asArray<Record<string, unknown>>(data.socialLinks);
  const [tab, setTab] = useState("sede");

  return (
    <div className="space-y-4">
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "sede", label: "Sede y horarios" },
          { id: "telefonos", label: "Teléfonos", count: phones.length },
          { id: "redes", label: "Redes", count: socialLinks.length },
        ]}
      />

      {tab === "sede" ? (
        <EditorCard title="Datos de la sede">
          <TextInput
            label="Dirección"
            value={String(contact.address || "")}
            onChange={(address) =>
              onChange({ ...data, contact: { ...contact, address } })
            }
          />
          <TextInput
            label="Teléfono central"
            value={String(contact.phone || "")}
            onChange={(phone) =>
              onChange({ ...data, contact: { ...contact, phone } })
            }
          />
          <TextArea
            label="Horario completo"
            value={String(contact.hours || "")}
            onChange={(hours) =>
              onChange({ ...data, contact: { ...contact, hours } })
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Horario L-V"
              value={String(contact.hoursWeekdays || "")}
              onChange={(hoursWeekdays) =>
                onChange({ ...data, contact: { ...contact, hoursWeekdays } })
              }
            />
            <TextInput
              label="Horario sábados"
              value={String(contact.hoursSaturday || "")}
              onChange={(hoursSaturday) =>
                onChange({ ...data, contact: { ...contact, hoursSaturday } })
              }
            />
          </div>
          <TextArea
            label="Nota de atención"
            value={String(contact.hoursNote || "")}
            onChange={(hoursNote) =>
              onChange({ ...data, contact: { ...contact, hoursNote } })
            }
          />
        </EditorCard>
      ) : null}

      {tab === "telefonos" ? (
        <ListEditor
          title="Teléfonos de atención"
          items={phones}
          onChange={(next) => onChange({ ...data, phones: next })}
          createItem={() => ({ label: "Nuevo teléfono", number: "" })}
          getTitle={(item) => String(item.label || "Teléfono")}
          renderItem={(item, _i, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="Nombre del área"
                value={String(item.label || "")}
                onChange={(label) => update({ label })}
              />
              <TextInput
                label="Número"
                value={String(item.number || "")}
                onChange={(number) => update({ number })}
              />
            </div>
          )}
        />
      ) : null}

      {tab === "redes" ? (
        <ListEditor
          title="Redes sociales"
          items={socialLinks}
          onChange={(next) => onChange({ ...data, socialLinks: next })}
          createItem={() => ({
            id: "facebook",
            label: "Facebook",
            href: "",
          })}
          getTitle={(item) => String(item.label || item.id || "Red")}
          renderItem={(item, _i, update) => (
            <>
              <SelectField
                label="Red"
                value={String(item.id || "facebook")}
                onChange={(id) =>
                  update({
                    id,
                    label:
                      id === "x"
                        ? "X (Twitter)"
                        : id.charAt(0).toUpperCase() + id.slice(1),
                  })
                }
                options={[
                  { value: "facebook", label: "Facebook" },
                  { value: "instagram", label: "Instagram" },
                  { value: "youtube", label: "YouTube" },
                  { value: "tiktok", label: "TikTok" },
                  { value: "x", label: "X (Twitter)" },
                ]}
              />
              <TextInput
                label="Enlace"
                value={String(item.href || "")}
                onChange={(href) => update({ href })}
              />
            </>
          )}
        />
      ) : null}
    </div>
  );
}

function LinkListForm({
  title,
  description,
  items,
  onChange,
}: {
  title: string;
  description: string;
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
}) {
  return (
    <ListEditor
      title={title}
      description={description}
      items={items}
      onChange={onChange}
      createItem={() => ({
        id: uid("link"),
        label: "Nuevo enlace",
        href: "https://",
      })}
      getTitle={(item) => String(item.label || "Enlace")}
      renderItem={(item, _i, update) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput
            label="Nombre"
            value={String(item.label || "")}
            onChange={(label) => update({ label })}
          />
          <TextInput
            label="URL"
            value={String(item.href || "")}
            onChange={(href) => update({ href })}
          />
        </div>
      )}
    />
  );
}

function GobiernoDigitalForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [tab, setTab] = useState("servicios");
  const servicios = asArray<Record<string, unknown>>(data.servicios);
  const aplicaciones = asArray<Record<string, unknown>>(data.aplicaciones);

  return (
    <div className="space-y-4">
      <TextInput
        label="Enlace oficial de Gobierno Digital"
        value={String(data.gobiernoDigitalUrl || "")}
        onChange={(gobiernoDigitalUrl) =>
          onChange({ ...data, gobiernoDigitalUrl })
        }
      />
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "servicios", label: "Servicios", count: servicios.length },
          {
            id: "aplicaciones",
            label: "Aplicaciones",
            count: aplicaciones.length,
          },
        ]}
      />
      {tab === "servicios" ? (
        <LinkListForm
          title="Servicios al ciudadano"
          description="Enlaces de consultas, pagos, reclamos, etc."
          items={servicios}
          onChange={(next) => onChange({ ...data, servicios: next })}
        />
      ) : (
        <LinkListForm
          title="Aplicaciones"
          description="Sistemas institucionales."
          items={aplicaciones}
          onChange={(next) => onChange({ ...data, aplicaciones: next })}
        />
      )}
    </div>
  );
}

function IntegridadForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [tab, setTab] = useState("topics");
  const topics = asArray<Record<string, unknown>>(data.topics);
  const documents = asArray<Record<string, unknown>>(data.documents);
  const components = asArray<Record<string, unknown>>(data.components);

  return (
    <div className="space-y-4">
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "topics", label: "Temas", count: topics.length },
          { id: "docs", label: "Documentos PDF", count: documents.length },
          { id: "comps", label: "Componentes", count: components.length },
        ]}
      />
      {tab === "topics" ? (
        <ListEditor
          title="Temas de integridad"
          items={topics}
          onChange={(next) => onChange({ ...data, topics: next })}
          createItem={() => ({
            id: uid("tema"),
            title: "Nuevo tema",
            description: "",
            image: "",
            imageAlt: "",
          })}
          getTitle={(item) => String(item.title || "Tema")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => update({ title })}
              />
              <TextArea
                label="Descripción"
                value={String(item.description || "")}
                onChange={(description) => update({ description })}
              />
              <MediaUpload
                label="Imagen / infografía"
                accept="image"
                value={String(item.image || "")}
                onChange={(image) => update({ image })}
              />
              <TextInput
                label="Texto alternativo de la imagen"
                value={String(item.imageAlt || "")}
                onChange={(imageAlt) => update({ imageAlt })}
              />
            </>
          )}
        />
      ) : null}
      {tab === "docs" ? (
        <ListEditor
          title="Documentos PDF"
          description="Sube programas, compromisos y otros PDFs."
          items={documents}
          onChange={(next) => onChange({ ...data, documents: next })}
          createItem={() => ({
            title: "Nuevo documento",
            date: "",
            href: "",
            description: "",
          })}
          getTitle={(item) => String(item.title || "Documento")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => update({ title })}
              />
              <TextInput
                label="Fecha"
                value={String(item.date || "")}
                onChange={(date) => update({ date })}
                placeholder="dd/mm/aaaa"
              />
              <MediaUpload
                label="Archivo PDF"
                accept="pdf"
                value={String(item.href || "")}
                onChange={(href) => update({ href })}
              />
              <TextArea
                label="Descripción"
                value={String(item.description || "")}
                onChange={(description) => update({ description })}
              />
            </>
          )}
        />
      ) : null}
      {tab === "comps" ? (
        <ListEditor
          title="Componentes del modelo"
          items={components}
          onChange={(next) => onChange({ ...data, components: next })}
          createItem={() => ({ title: "Nuevo componente", description: "" })}
          getTitle={(item) => String(item.title || "Componente")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => update({ title })}
              />
              <TextArea
                label="Descripción"
                value={String(item.description || "")}
                onChange={(description) => update({ description })}
              />
            </>
          )}
        />
      ) : null}
    </div>
  );
}

function NormasForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [tab, setTab] = useState("cats");
  const categories = asArray<Record<string, unknown>>(data.categories);
  const publications = asArray<Record<string, unknown>>(data.publications);

  return (
    <div className="space-y-4">
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "cats", label: "Normas", count: categories.length },
          {
            id: "pubs",
            label: "Otras publicaciones",
            count: publications.length,
          },
        ]}
      />
      {tab === "cats" ? (
        <ListEditor
          title="Categorías de normas"
          items={categories}
          onChange={(next) => onChange({ ...data, categories: next })}
          createItem={() => ({
            id: uid("norm"),
            title: "Nueva norma",
            description: "",
            href: "",
            documents: [],
          })}
          getTitle={(item) => String(item.title || "Norma")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => {
                  const id = slugify(title) || String(item.id);
                  update({
                    title,
                    id,
                    href: `/normas-legales-y-publicaciones/c/${id}`,
                  });
                }}
              />
              <TextArea
                label="Descripción"
                value={String(item.description || "")}
                onChange={(description) => update({ description })}
              />
              <ListEditor
                title="Documentos PDF de esta categoría"
                items={asArray<Record<string, unknown>>(item.documents)}
                onChange={(documents) => update({ documents })}
                createItem={() => ({
                  title: "Nuevo documento",
                  href: "",
                  date: "",
                })}
                getTitle={(doc) => String(doc.title || "Documento")}
                renderItem={(doc, _di, updateDoc) => (
                  <>
                    <TextInput
                      label="Título"
                      value={String(doc.title || "")}
                      onChange={(title) => updateDoc({ title })}
                    />
                    <TextInput
                      label="Fecha"
                      value={String(doc.date || "")}
                      onChange={(date) => updateDoc({ date })}
                    />
                    <MediaUpload
                      label="PDF"
                      accept="pdf"
                      value={String(doc.href || "")}
                      onChange={(href) => updateDoc({ href })}
                    />
                  </>
                )}
              />
            </>
          )}
        />
      ) : (
        <ListEditor
          title="Otras publicaciones"
          items={publications}
          onChange={(next) => onChange({ ...data, publications: next })}
          createItem={() => ({
            id: uid("pub"),
            title: "Nueva publicación",
            description: "",
            href: "",
            date: "",
            documents: [],
          })}
          getTitle={(item) => String(item.title || "Publicación")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Título"
                value={String(item.title || "")}
                onChange={(title) => {
                  const id = slugify(title) || String(item.id);
                  update({
                    title,
                    id,
                    href: `/normas-legales-y-publicaciones/p/${id}`,
                  });
                }}
              />
              <TextInput
                label="Fecha"
                value={String(item.date || "")}
                onChange={(date) => update({ date })}
              />
              <TextArea
                label="Descripción"
                value={String(item.description || "")}
                onChange={(description) => update({ description })}
              />
              <ListEditor
                title="Archivos de la publicación"
                items={asArray<Record<string, unknown>>(item.documents)}
                onChange={(documents) => update({ documents })}
                createItem={() => ({
                  title: "Nuevo archivo",
                  href: "",
                  date: "",
                })}
                getTitle={(doc) => String(doc.title || "Archivo")}
                renderItem={(doc, _di, updateDoc) => (
                  <>
                    <TextInput
                      label="Nombre"
                      value={String(doc.title || "")}
                      onChange={(title) => updateDoc({ title })}
                    />
                    <MediaUpload
                      label="PDF o archivo"
                      accept="any"
                      value={String(doc.href || "")}
                      onChange={(href) => updateDoc({ href })}
                    />
                  </>
                )}
              />
            </>
          )}
        />
      )}
    </div>
  );
}

function NavForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [tab, setTab] = useState("nav");
  const mainNav = asArray<Record<string, unknown>>(data.mainNav);
  const socialLinks = asArray<Record<string, unknown>>(data.socialLinks);
  const externalLinks = asRecord(data.externalLinks);

  return (
    <div className="space-y-4">
      <SectionTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "nav", label: "Menú principal", count: mainNav.length },
          { id: "social", label: "Redes", count: socialLinks.length },
          { id: "ext", label: "Enlaces externos" },
        ]}
      />
      {tab === "nav" ? (
        <ListEditor
          title="Menú principal"
          description="Ítems de la barra verde del portal."
          items={mainNav}
          onChange={(next) => onChange({ ...data, mainNav: next })}
          createItem={() => ({
            label: "Nuevo menú",
            href: "/",
            children: [],
          })}
          getTitle={(item) => String(item.label || "Menú")}
          renderItem={(item, _i, update) => {
            const children = asArray<Record<string, unknown>>(item.children);
            return (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextInput
                    label="Etiqueta"
                    value={String(item.label || "")}
                    onChange={(label) => update({ label })}
                  />
                  <TextInput
                    label="Enlace"
                    value={String(item.href || "")}
                    onChange={(href) => update({ href })}
                  />
                </div>
                <ToggleField
                  label="Abrir en pestaña nueva"
                  checked={Boolean(item.openInNewTab || item.external)}
                  onChange={(openInNewTab) =>
                    update({ openInNewTab, external: openInNewTab })
                  }
                />
                <ListEditor
                  title="Submenú"
                  description="Opciones del desplegable (opcional)."
                  items={children}
                  onChange={(next) => update({ children: next })}
                  createItem={() => ({
                    label: "Opción",
                    href: "/",
                    description: "",
                  })}
                  getTitle={(child) => String(child.label || "Opción")}
                  renderItem={(child, _ci, updateChild) => (
                    <>
                      <TextInput
                        label="Nombre"
                        value={String(child.label || "")}
                        onChange={(label) => updateChild({ label })}
                      />
                      <TextInput
                        label="Enlace"
                        value={String(child.href || "")}
                        onChange={(href) => updateChild({ href })}
                      />
                      <TextInput
                        label="Descripción corta"
                        value={String(child.description || "")}
                        onChange={(description) => updateChild({ description })}
                      />
                    </>
                  )}
                />
              </>
            );
          }}
        />
      ) : null}
      {tab === "social" ? (
        <ListEditor
          title="Redes globales"
          items={socialLinks}
          onChange={(next) => onChange({ ...data, socialLinks: next })}
          createItem={() => ({ id: "facebook", label: "Facebook", href: "" })}
          getTitle={(item) => String(item.label || "Red")}
          renderItem={(item, _i, update) => (
            <>
              <TextInput
                label="Nombre"
                value={String(item.label || "")}
                onChange={(label) => update({ label })}
              />
              <TextInput
                label="ID (facebook, youtube…)"
                value={String(item.id || "")}
                onChange={(id) => update({ id })}
              />
              <TextInput
                label="Enlace"
                value={String(item.href || "")}
                onChange={(href) => update({ href })}
              />
            </>
          )}
        />
      ) : null}
      {tab === "ext" ? (
        <EditorCard
          title="Enlaces externos frecuentes"
          subtitle="URLs usadas en varios puntos del portal"
        >
          {Object.keys(externalLinks).length === 0 ? (
            <p className="text-sm text-molina-muted">No hay enlaces.</p>
          ) : (
            Object.entries(externalLinks).map(([key, value]) => (
              <TextInput
                key={key}
                label={key}
                value={String(value || "")}
                onChange={(next) =>
                  onChange({
                    ...data,
                    externalLinks: { ...externalLinks, [key]: next },
                  })
                }
              />
            ))
          )}
        </EditorCard>
      ) : null}
    </div>
  );
}

function ControlInternoForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const periods = asArray<Record<string, unknown>>(data.periods);
  return (
    <ListEditor
      title="Periodos de control interno"
      description="Planes, evaluaciones y seguimientos por año. Sube los PDF."
      items={periods}
      onChange={(next) => onChange({ ...data, periods: next })}
      createItem={() => ({
        year: new Date().getFullYear(),
        documents: [],
      })}
      getTitle={(item) => `Año ${String(item.year || "")}`}
      renderItem={(item, _i, update) => {
        const docs = asArray<Record<string, unknown>>(item.documents);
        return (
          <>
            <TextInput
              label="Año"
              type="number"
              value={String(item.year || "")}
              onChange={(year) => update({ year: Number(year) || year })}
            />
            <ListEditor
              title="Documentos del periodo"
              items={docs}
              onChange={(documents) => update({ documents })}
              createItem={() => ({
                title: "Nuevo documento",
                kind: "Plan de acción",
                href: "",
              })}
              getTitle={(doc) => String(doc.title || "Documento")}
              renderItem={(doc, _di, updateDoc) => (
                <>
                  <TextInput
                    label="Título"
                    value={String(doc.title || "")}
                    onChange={(title) => updateDoc({ title })}
                  />
                  <SelectField
                    label="Tipo"
                    value={String(doc.kind || "Plan de acción")}
                    onChange={(kind) => updateDoc({ kind })}
                    options={[
                      { value: "Plan de acción", label: "Plan de acción" },
                      { value: "Evaluación", label: "Evaluación" },
                      { value: "Seguimiento", label: "Seguimiento" },
                    ]}
                  />
                  <MediaUpload
                    label="PDF"
                    accept="pdf"
                    value={String(doc.href || "")}
                    onChange={(href) => updateDoc({ href })}
                  />
                </>
              )}
            />
          </>
        );
      }}
    />
  );
}

function MolinaTvForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const categories = asArray<Record<string, unknown>>(data.categories);
  return (
    <div className="space-y-4">
      <TextInput
        label="Título de la sección"
        value={String(data.title || "")}
        onChange={(title) => onChange({ ...data, title })}
      />
      <ListEditor
        title="Categorías de La Molina TV"
        items={categories}
        onChange={(next) => onChange({ ...data, categories: next })}
        createItem={() => ({
          slug: uid("tv"),
          title: "Nueva categoría",
          breadcrumb: "",
          sourceUrl: "",
          headings: [],
          videos: [],
        })}
        getTitle={(item) => String(item.title || "Categoría")}
        renderItem={(item, _i, update) => {
          const videos = asArray<Record<string, unknown>>(item.videos);
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  label="Título"
                  value={String(item.title || "")}
                  onChange={(title) =>
                    update({
                      title,
                      slug: item.slug ? String(item.slug) : slugify(title),
                    })
                  }
                />
                <TextInput
                  label="Slug (URL)"
                  value={String(item.slug || "")}
                  onChange={(slug) => update({ slug })}
                />
              </div>
              <ListEditor
                title="Videos"
                items={videos}
                onChange={(next) => update({ videos: next })}
                createItem={() => ({
                  title: "Nuevo video",
                  url: "",
                  provider: "youtube",
                  embedUrl: "",
                  youtubeId: "",
                })}
                getTitle={(video) => String(video.title || "Video")}
                renderItem={(video, _vi, updateVideo) => (
                  <>
                    <TextInput
                      label="Título"
                      value={String(video.title || "")}
                      onChange={(title) => updateVideo({ title })}
                    />
                    <SelectField
                      label="Proveedor"
                      value={String(video.provider || "youtube")}
                      onChange={(provider) => updateVideo({ provider })}
                      options={[
                        { value: "youtube", label: "YouTube" },
                        { value: "facebook", label: "Facebook" },
                        { value: "live", label: "En vivo" },
                      ]}
                    />
                    <TextInput
                      label="URL del video"
                      value={String(video.url || "")}
                      onChange={(url) => updateVideo({ url })}
                    />
                    <TextInput
                      label="URL de inserción (embed)"
                      value={String(video.embedUrl || "")}
                      onChange={(embedUrl) => updateVideo({ embedUrl })}
                    />
                    <TextInput
                      label="ID de YouTube (opcional)"
                      value={String(video.youtubeId || "")}
                      onChange={(youtubeId) => updateVideo({ youtubeId })}
                    />
                  </>
                )}
              />
            </>
          );
        }}
      />
    </div>
  );
}

function TalleresForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const categories = asArray<Record<string, unknown>>(data.categories);
  return (
    <div className="space-y-4">
      <TextInput
        label="Título"
        value={String(data.title || "")}
        onChange={(title) => onChange({ ...data, title })}
      />
      <ListEditor
        title="Categorías de talleres"
        description="Agrega categorías e imágenes de las galerías."
        items={categories}
        onChange={(next) => onChange({ ...data, categories: next })}
        createItem={() => ({
          slug: uid("taller"),
          title: "Nueva categoría",
          pageTitle: "",
          breadcrumb: "",
          sourceUrl: "",
          icon: { type: "fa", name: "drama" },
          notice: null,
          headings: [],
          images: [],
        })}
        getTitle={(item) => String(item.title || "Categoría")}
        renderItem={(item, _i, update) => {
          const images = asArray<Record<string, unknown>>(item.images);
          return (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  label="Título"
                  value={String(item.title || "")}
                  onChange={(title) =>
                    update({
                      title,
                      pageTitle: title,
                      slug: item.slug ? String(item.slug) : slugify(title),
                    })
                  }
                />
                <TextInput
                  label="Aviso (opcional)"
                  value={String(item.notice || "")}
                  onChange={(notice) => update({ notice: notice || null })}
                />
              </div>
              <ListEditor
                title="Imágenes de la galería"
                items={images}
                onChange={(next) => update({ images: next })}
                createItem={() => ({
                  url: "",
                  sourceUrl: "",
                  alt: "",
                  title: "",
                  bytes: 0,
                })}
                getTitle={(img) =>
                  String(img.title || img.alt || "Imagen")
                }
                renderItem={(img, _ii, updateImg) => (
                  <>
                    <MediaUpload
                      label="Imagen"
                      accept="image"
                      value={String(img.url || "")}
                      onChange={(url) => updateImg({ url, sourceUrl: url })}
                    />
                    <TextInput
                      label="Título"
                      value={String(img.title || "")}
                      onChange={(title) => updateImg({ title })}
                    />
                    <TextInput
                      label="Texto alternativo"
                      value={String(img.alt || "")}
                      onChange={(alt) => updateImg({ alt })}
                    />
                  </>
                )}
              />
            </>
          );
        }}
      />
    </div>
  );
}

function TramitesForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const procedures = asArray<Record<string, unknown>>(data.procedures);
  return (
    <ListEditor
      title="Trámites municipales"
      description="Registra o actualiza trámites. Puedes eliminar los que ya no apliquen."
      items={procedures}
      onChange={(next) => onChange({ ...data, procedures: next })}
      createItem={() => {
        const title = "Nuevo trámite";
        return {
          slug: `${slugify(title) || "tramite"}-${uid("n").slice(-4)}`,
          title,
          categories: ["Vecinos"],
          summary: "",
          directedTo: "",
          when: "",
          channels: [
            {
              type: "Presencial",
              description:
                "Palacio Municipal, Av. Ricardo Elías Aparicio 740, La Molina.",
              schedule: "Lunes a viernes de 8:10 a.m. a 5:20 p.m.",
            },
          ],
          duration: "",
          cost: "",
          requirements: [],
          documents: [],
          result: "",
        };
      }}
      getTitle={(item) => String(item.title || "Trámite")}
      renderItem={(item, _i, update) => {
        const channels = asArray<Record<string, unknown>>(item.channels);
        return (
        <>
          <TextInput
            label="Título"
            value={String(item.title || "")}
            onChange={(title) =>
              update({
                title,
                slug: item.slug ? String(item.slug) : slugify(title),
              })
            }
          />
          <TextInput
            label="Slug (URL pública)"
            value={String(item.slug || "")}
            onChange={(slug) => update({ slug: slugify(slug) || String(item.slug) })}
            hint="Se usa en /tramites-municipales/[slug]. No lo cambies si ya está publicado."
          />
          <TextArea
            label="Resumen"
            value={String(item.summary || "")}
            onChange={(summary) => update({ summary })}
          />
          <SelectField
            label="Categoría principal"
            value={String(asArray<string>(item.categories)[0] || "Vecinos")}
            onChange={(cat) => update({ categories: [cat] })}
            options={[
              "Vecinos",
              "Negocios",
              "Registro Civil",
              "Edificación",
              "TUPA",
            ].map((v) => ({ value: v, label: v }))}
          />
          <TextArea
            label="¿A quién va dirigido?"
            value={String(item.directedTo || "")}
            onChange={(directedTo) => update({ directedTo })}
          />
          <TextArea
            label="¿Cuándo solicitarlo?"
            value={String(item.when || "")}
            onChange={(when) => update({ when })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Duración"
              value={String(item.duration || "")}
              onChange={(duration) => update({ duration })}
            />
            <TextInput
              label="Costo"
              value={String(item.cost || "")}
              onChange={(cost) => update({ cost })}
            />
          </div>
          <ListEditor
            title="Canales de atención"
            description="Sin canales, la tarjeta pública no muestra badges (Presencial/Virtual)."
            items={channels}
            onChange={(next) => update({ channels: next })}
            createItem={() => ({
              type: "Presencial",
              description:
                "Palacio Municipal, Av. Ricardo Elías Aparicio 740, La Molina.",
              schedule: "Lunes a viernes de 8:10 a.m. a 5:20 p.m.",
            })}
            getTitle={(ch) => String(ch.type || "Canal")}
            renderItem={(ch, _ci, updateCh) => (
              <>
                <SelectField
                  label="Tipo"
                  value={String(ch.type || "Presencial")}
                  onChange={(type) => updateCh({ type })}
                  options={[
                    "Presencial",
                    "Virtual",
                    "Web",
                    "Telefónico",
                    "100% en línea",
                  ].map((v) => ({ value: v, label: v }))}
                />
                <TextArea
                  label="Descripción"
                  value={String(ch.description || "")}
                  onChange={(description) => updateCh({ description })}
                />
                <TextInput
                  label="Horario (opcional)"
                  value={String(ch.schedule || "")}
                  onChange={(schedule) => updateCh({ schedule })}
                />
              </>
            )}
          />
          <StringListEditor
            label="Requisitos"
            items={asArray<string>(item.requirements)}
            onChange={(requirements) => update({ requirements })}
            placeholder="Requisito"
          />
          <StringListEditor
            label="Documentos"
            items={asArray<string>(item.documents)}
            onChange={(documents) => update({ documents })}
            placeholder="Documento"
          />
          <TextArea
            label="Resultado"
            value={String(item.result || "")}
            onChange={(result) => update({ result })}
          />
        </>
        );
      }}
    />
  );
}

function MuniserviciosForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const categories = asArray<Record<string, unknown>>(data.categories);
  return (
    <ListEditor
      title="Categorías Muniservicios"
      description="Áreas y programas. Dentro de cada una puedes agregar servicios."
      items={categories}
      onChange={(next) => onChange({ ...data, categories: next })}
      createItem={() => ({
        slug: uid("ms"),
        title: "Nueva área",
        summary: "",
        services: [],
      })}
      getTitle={(item) => String(item.title || "Área")}
      renderItem={(item, _i, update) => {
        const services = asArray<Record<string, unknown>>(item.services);
        return (
          <>
            <TextInput
              label="Título del área"
              value={String(item.title || "")}
              onChange={(title) =>
                update({
                  title,
                  slug: item.slug ? String(item.slug) : slugify(title),
                })
              }
            />
            <TextArea
              label="Resumen"
              value={String(item.summary || "")}
              onChange={(summary) => update({ summary })}
            />
            <ListEditor
              title="Servicios del área"
              items={services}
              onChange={(next) => update({ services: next })}
              createItem={() => ({
                slug: uid("svc"),
                title: "Nuevo servicio",
                summary: "",
                details: [],
              })}
              getTitle={(svc) => String(svc.title || "Servicio")}
              renderItem={(svc, _si, updateSvc) => (
                <>
                  <TextInput
                    label="Nombre"
                    value={String(svc.title || "")}
                    onChange={(title) => updateSvc({ title })}
                  />
                  <TextArea
                    label="Resumen"
                    value={String(svc.summary || "")}
                    onChange={(summary) => updateSvc({ summary })}
                  />
                  <StringListEditor
                    label="Detalles"
                    items={asArray<string>(svc.details)}
                    onChange={(details) => updateSvc({ details })}
                  />
                </>
              )}
            />
          </>
        );
      }}
    />
  );
}

function GestionForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const sections = asArray<Record<string, unknown>>(data.sections);
  const images = asArray<Record<string, unknown>>(data.images);

  return (
    <div className="space-y-6">
      <TextInput
        label="Título de la sección"
        value={String(data.title || "")}
        onChange={(title) => onChange({ ...data, title })}
      />
      <ListEditor
        title="Imágenes destacadas"
        items={images}
        onChange={(next) => onChange({ ...data, images: next })}
        createItem={() => ({ url: "", sourceUrl: "", bytes: 0 })}
        getTitle={(img, i) => `Imagen ${i + 1}`}
        renderItem={(img, _i, update) => (
          <MediaUpload
            label="Imagen"
            accept="image"
            value={String(img.url || "")}
            onChange={(url) => update({ url, sourceUrl: url })}
          />
        )}
      />
      <ListEditor
        title="Apartados de Gestión Municipal"
        description="Alcalde, concejo, estructura, etc. Edita el resumen y los textos."
        items={sections}
        onChange={(next) => onChange({ ...data, sections: next })}
        createItem={() => ({
          slug: uid("gm"),
          title: "Nuevo apartado",
          summary: "",
          paragraphs: [],
          documents: [],
        })}
        getTitle={(item) => String(item.title || "Apartado")}
        renderItem={(item, _i, update) => (
          <>
            <TextInput
              label="Título"
              value={String(item.title || "")}
              onChange={(title) =>
                update({
                  title,
                  slug: item.slug ? String(item.slug) : slugify(title),
                })
              }
            />
            <TextArea
              label="Resumen"
              value={String(item.summary || "")}
              onChange={(summary) => update({ summary })}
            />
            <StringListEditor
              label="Párrafos de contenido"
              items={asArray<string>(item.paragraphs)}
              onChange={(paragraphs) => update({ paragraphs })}
              placeholder="Escribe un párrafo…"
            />
            <ListEditor
              title="Documentos del apartado"
              items={asArray<Record<string, unknown>>(item.documents)}
              onChange={(documents) => update({ documents })}
              createItem={() => ({ label: "Documento", url: "", sourceUrl: "" })}
              getTitle={(doc) => String(doc.label || "Documento")}
              renderItem={(doc, _di, updateDoc) => (
                <>
                  <TextInput
                    label="Nombre"
                    value={String(doc.label || "")}
                    onChange={(label) => updateDoc({ label })}
                  />
                  <MediaUpload
                    label="PDF o archivo"
                    accept="any"
                    value={String(doc.url || "")}
                    onChange={(url) => updateDoc({ url, sourceUrl: url })}
                  />
                </>
              )}
            />
          </>
        )}
      />
    </div>
  );
}
