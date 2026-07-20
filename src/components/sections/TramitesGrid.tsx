"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Upload,
  UserRoundCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSso } from "@/components/auth/SsoProvider";
import {
  CITIZEN_APPLICATIONS,
  EXTERNAL_LINKS,
} from "@/data/portal-data";
import {
  MUNICIPAL_PROCEDURES,
  type MunicipalProcedureCategory,
  type MunicipalProcedureDetail,
} from "@/data/municipal-procedures";
import type {
  CitizenApplication,
  LicenseWizardStep,
  MesaPartesForm,
  TaxSimulationResult,
} from "@/types/portal";
import { MunicipalityLogo } from "@/components/ui/MunicipalityLogo";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

type AppGroup = {
  id: string;
  title: string;
  description: string;
  appIds: string[];
};

const APP_GROUPS: AppGroup[] = [
  {
    id: "tupa-digital",
    title: "TUPA Digital",
    description: "Trámites y servicios en línea",
    appIds: [
      "plataforma-tupa",
      "pagos-tributarios",
      "estado-cuenta",
      "mesa-partes",
      "consulta-mesa-partes",
    ],
  },
  {
    id: "integridad",
    title: "Integridad",
    description: "Canal de denuncias",
    appIds: ["denuncias-corrupcion"],
  },
];

type ProcedureTab = MunicipalProcedureCategory;

const PROCEDURE_TABS: ProcedureTab[] = [
  "Vecinos",
  "Negocios",
  "Registro Civil",
  "Edificación",
  "TUPA",
];

const LICENSE_STEPS_INITIAL: LicenseWizardStep[] = [
  {
    id: "1",
    title: "Datos del solicitante",
    description: "DNI/RUC y domicilio fiscal del establecimiento",
    completed: false,
  },
  {
    id: "2",
    title: "Giro y rubro",
    description: "Clasificación CIIU y tipo de actividad comercial",
    completed: false,
  },
  {
    id: "3",
    title: "Requisitos técnicos",
    description: "Planos, ITSE y certificado de Defensa Civil",
    completed: false,
  },
  {
    id: "4",
    title: "Pago y emisión",
    description: "Tasa administrativa y descarga de licencia digital",
    completed: false,
  },
];

export interface TramitesGridProps {
  externalSearch?: string;
}

type ActivePanel =
  | "tributos"
  | "mesa-partes"
  | "licencias"
  | "estado-cuenta"
  | null;

export function TramitesGrid({ externalSearch = "" }: TramitesGridProps) {
  const { isAuthenticated, signIn, openApp } = useSso();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [openGroup, setOpenGroup] = useState<string>("tupa-digital");
  const [activeProcedureTab, setActiveProcedureTab] =
    useState<ProcedureTab>("Vecinos");

  const applications = useMemo(() => {
    const q = externalSearch.trim().toLowerCase();
    if (!q) return CITIZEN_APPLICATIONS;
    return CITIZEN_APPLICATIONS.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q),
    );
  }, [externalSearch]);

  const groups = useMemo(() => {
    const q = externalSearch.trim().toLowerCase();
    return APP_GROUPS.map((group) => ({
      ...group,
      apps: group.appIds
        .map((id) => applications.find((app) => app.id === id))
        .filter((app): app is CitizenApplication => Boolean(app)),
    })).filter((group) => {
      if (!q) return group.apps.length > 0;
      return group.apps.length > 0;
    });
  }, [applications, externalSearch]);

  const procedures = useMemo(() => {
    const q = externalSearch.trim().toLowerCase();
    return MUNICIPAL_PROCEDURES.filter((procedure) => {
      if (!procedure.categories.includes(activeProcedureTab)) return false;
      if (!q) return true;
      return (
        procedure.title.toLowerCase().includes(q) ||
        procedure.summary.toLowerCase().includes(q) ||
        procedure.requirements.some((requirement) =>
          requirement.toLowerCase().includes(q),
        )
      );
    });
  }, [activeProcedureTab, externalSearch]);

  const openPanel = useCallback((panel: ActivePanel) => {
    setActivePanel(panel);
  }, []);

  const handleApplicationAction = useCallback(
    (app: CitizenApplication) => {
      if (app.appUrl && /^https?:\/\//i.test(app.appUrl)) {
        window.open(app.appUrl, "_blank", "noopener,noreferrer");
        return;
      }

      if (app.requiresAuth && !isAuthenticated) {
        signIn(`${window.location.origin}/plataforma-digital#${app.id}`);
        return;
      }

      if (app.panel) {
        openPanel(app.panel);
        return;
      }

      if (app.appUrl) {
        if (app.requiresAuth) {
          openApp(app.appUrl);
        } else {
          window.location.href = app.appUrl;
        }
      }
    },
    [isAuthenticated, signIn, openApp, openPanel],
  );

  const handleProcedureAction = useCallback(
    (procedure: MunicipalProcedureDetail) => {
      window.location.href = `/tramites-municipales/${procedure.slug}`;
    },
    [],
  );

  return (
    <section className="bg-white pb-16 pt-8 lg:pb-24 lg:pt-12">
      <Reveal variant="up" className="mx-auto max-w-4xl px-4 text-center">
        <MunicipalityLogo
          variant="light"
          height={52}
          priority
          className="mx-auto"
        />
        <h1 className="mt-5 text-2xl font-bold text-molina-ink lg:text-3xl">
          Municipalidad de La Molina
        </h1>
        <p className="mt-1 text-base text-molina-muted lg:text-lg">
          Aplicaciones para el ciudadano
        </p>
      </Reveal>

      <div className="mx-auto mt-10 max-w-3xl space-y-3 px-4">
        {groups.map((group, groupIndex) => {
          const isOpen = openGroup === group.id;
          const panelId = `${group.id}-apps`;

          return (
            <Reveal
              key={group.id}
              variant="up"
              delayMs={100 + groupIndex * 100}
              className={cn(
                "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow",
                isOpen && "shadow-md ring-1 ring-molina-mint/30",
              )}
            >
              <button
                type="button"
                id={`${group.id}-trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setOpenGroup((current) =>
                    current === group.id ? "" : group.id,
                  )
                }
                className="flex w-full items-center gap-3 bg-molina-deep px-5 py-4 text-left text-white transition-colors hover:bg-[#0a5c45]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">{group.title}</span>
                  <span className="mt-0.5 block text-xs text-white/75">
                    {group.description} · {group.apps.length} opciones
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={`${group.id}-trigger`}
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="divide-y divide-slate-100">
                    {group.apps.map((app) => {
                      const needsLogin = app.requiresAuth && !isAuthenticated;
                      return (
                        <li key={app.id} id={app.id} className="scroll-mt-28">
                          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-molina-ink">
                                {app.title}
                              </p>
                              <p className="mt-1 text-sm text-molina-muted">
                                {app.description}
                              </p>
                              {app.requiresAuth && (
                                <p className="mt-1 text-xs text-molina-muted">
                                  Requiere iniciar sesión
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplicationAction(app)}
                              className="shrink-0 rounded-md border-2 border-molina-ink px-4 py-2 text-sm font-semibold text-molina-ink transition-colors hover:bg-slate-50"
                            >
                              {needsLogin ? "Iniciar sesión" : "Abrir"}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}

        {groups.every((g) => g.apps.length === 0) && (
          <p className="py-12 text-center text-molina-muted">
            No se encontraron aplicaciones con tu búsqueda.
          </p>
        )}
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-4">
        <Reveal variant="up" className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-molina-teal">
            Catálogo municipal
          </p>
          <h2 className="mt-2 text-2xl font-bold text-molina-deep lg:text-3xl">
            Trámites Municipales
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-molina-muted">
            Selecciona una categoría para consultar los trámites dirigidos a
            vecinos, negocios, registro civil y proyectos de edificación.
          </p>
        </Reveal>

        <Reveal
          variant="up"
          delayMs={80}
          className="mt-7 flex gap-2 overflow-x-auto pb-2"
        >
          {PROCEDURE_TABS.map((tab) => {
            const count = MUNICIPAL_PROCEDURES.filter((procedure) =>
              procedure.categories.includes(tab),
            ).length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveProcedureTab(tab)}
                aria-pressed={activeProcedureTab === tab}
                className={cn(
                  "shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
                  activeProcedureTab === tab
                    ? "border-molina-deep bg-molina-deep text-white"
                    : "border-slate-300 bg-white text-molina-deep hover:border-molina-mint hover:bg-emerald-50",
                )}
              >
                {tab}
                <span
                  className={cn(
                    "ml-2 rounded-full px-2 py-0.5 text-xs",
                    activeProcedureTab === tab
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-molina-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </Reveal>

        {procedures.length > 0 ? (
          <div
            key={activeProcedureTab}
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {procedures.map((procedure, index) => (
              <Reveal
                key={procedure.slug}
                variant="up"
                delayMs={50 + (index % 6) * 60}
              >
                <article
                  id={`tramite-${procedure.slug}`}
                  className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-molina-mint/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-molina-teal">
                      <FileText className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        procedure.channels.some(
                          (channel) => channel.type === "Virtual",
                        )
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {procedure.channels.some(
                        (channel) => channel.type === "Virtual",
                      )
                        ? "Canal virtual"
                        : "Presencial"}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold leading-6 text-molina-deep">
                    {procedure.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-molina-muted">
                    {procedure.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleProcedureAction(procedure)}
                    className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-molina-teal hover:underline"
                  >
                    Ver información
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-molina-muted">
            No se encontraron trámites en esta categoría con tu búsqueda.
          </p>
        )}
      </div>

      <TributosPanel
        open={activePanel === "tributos"}
        onClose={() => setActivePanel(null)}
      />
      <EstadoCuentaPanel
        open={activePanel === "estado-cuenta"}
        onClose={() => setActivePanel(null)}
      />
      <MesaPartesPanel
        open={activePanel === "mesa-partes"}
        onClose={() => setActivePanel(null)}
      />
      <LicenciasPanel
        open={activePanel === "licencias"}
        onClose={() => setActivePanel(null)}
      />
    </section>
  );
}

function TributosPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [docType, setDocType] = useState<"DNI" | "RUC">("DNI");
  const [docNumber, setDocNumber] = useState("");
  const [year, setYear] = useState(2026);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxSimulationResult | null>(null);

  const handleConsult = () => {
    if (!docNumber.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const lastDigit = parseInt(docNumber.slice(-1), 10) || 0;
      const totalDue = (lastDigit + 1) * 127.5;
      setResult({
        totalDue,
        status:
          lastDigit % 3 === 0
            ? "al_dia"
            : lastDigit % 3 === 1
              ? "pendiente"
              : "vencido",
        items: [
          { concept: "Arbitrios municipales", amount: totalDue * 0.4 },
          { concept: "Impuesto predial", amount: totalDue * 0.45 },
          { concept: "Gastos administrativos", amount: totalDue * 0.15 },
        ],
      });
      setLoading(false);
    }, 1200);
  };

  const statusLabels = {
    al_dia: { label: "Al día", className: "bg-emerald-100 text-emerald-800" },
    pendiente: { label: "Pendiente", className: "bg-amber-100 text-amber-800" },
    vencido: { label: "Vencido", className: "bg-red-100 text-red-800" },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pagos Tributarios En Línea"
      description="Consulta simulada de deudas tributarias distritales"
      className="lg:max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["DNI", "RUC"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDocType(t)}
              className={cn(
                "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
                docType === t
                  ? "bg-molina-mint text-white"
                  : "bg-slate-100 text-molina-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Input
          label={`Número de ${docType}`}
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          placeholder={docType === "DNI" ? "12345678" : "20123456789"}
          maxLength={docType === "DNI" ? 8 : 11}
        />
        <Input
          label="Año tributario"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min={2020}
          max={2026}
        />
        <Button
          className="w-full"
          onClick={handleConsult}
          disabled={loading || !docNumber.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Consultando...
            </>
          ) : (
            "Consultar deuda"
          )}
        </Button>

        {result && (
          <div className="rounded-xl border border-slate-100 bg-molina-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-molina-muted">
                Estado tributario
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-bold",
                  statusLabels[result.status].className,
                )}
              >
                {statusLabels[result.status].label}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {result.items.map((item) => (
                <li
                  key={item.concept}
                  className="flex justify-between text-sm"
                >
                  <span>{item.concept}</span>
                  <span className="font-semibold">
                    S/ {item.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold text-molina-deep">
              <span>Total</span>
              <span>S/ {result.totalDue.toFixed(2)}</span>
            </div>
            {result.status !== "al_dia" && (
              <Button className="mt-4 w-full" variant="secondary">
                Proceder al pago en línea
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function EstadoCuentaPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Estado de Cuenta y Recibos de Pago"
      description="Información oficial del trámite tributario municipal"
      className="lg:max-w-2xl"
    >
      <div className="space-y-6">
        <p className="text-sm leading-6 text-molina-muted">
          Permite al propietario de un predio, o a su representante legal,
          conocer todos los impuestos y tasas pendientes de pago.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4">
            <UserRoundCheck className="h-5 w-5 text-molina-teal" aria-hidden />
            <h3 className="mt-2 text-sm font-bold text-molina-deep">
              ¿A quién está dirigido?
            </h3>
            <p className="mt-1 text-sm leading-6 text-molina-muted">
              A personas naturales o jurídicas propietarias de un predio en La
              Molina, o a sus representantes legales.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <FileText className="h-5 w-5 text-molina-teal" aria-hidden />
            <h3 className="mt-2 text-sm font-bold text-molina-deep">
              Requisitos
            </h3>
            <p className="mt-1 text-sm leading-6 text-molina-muted">
              Ser titular del predio y presentar DNI. El representante debe
              acreditar poder notarial.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <CheckCircle2 className="h-5 w-5 text-molina-teal" aria-hidden />
            <h3 className="mt-2 text-sm font-bold text-molina-deep">
              Duración y costo
            </h3>
            <p className="mt-1 text-sm leading-6 text-molina-muted">
              Atención automática y sin costo.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <FileText className="h-5 w-5 text-molina-teal" aria-hidden />
            <h3 className="mt-2 text-sm font-bold text-molina-deep">
              ¿Qué obtendrás?
            </h3>
            <p className="mt-1 text-sm leading-6 text-molina-muted">
              El estado de cuenta integral de tus predios y su liquidación para
              el pago de deudas.
            </p>
          </article>
        </div>

        <div>
          <h3 className="text-base font-bold text-molina-deep">
            Canales de atención
          </h3>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-bold text-molina-deep">
                Atención virtual
              </p>
              <p className="mt-1 text-sm leading-6 text-molina-muted">
                Solicita el documento mediante Mesa de Partes Virtual o escribe
                a{" "}
                <a
                  href="mailto:mesadepartes@munimolina.gob.pe"
                  className="font-semibold text-molina-teal hover:underline"
                >
                  mesadepartes@munimolina.gob.pe
                </a>
                . Horario administrativo: lunes a viernes de 8:00 a.m. a 7:00
                p.m.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex gap-2">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-molina-teal"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-bold text-molina-deep">
                    Atención presencial
                  </p>
                  <p className="mt-1 text-sm leading-6 text-molina-muted">
                    Palacio Municipal, Av. Ricardo Elías Aparicio 740, La
                    Molina. Lunes a viernes de 8:00 a.m. a 5:00 p.m.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-molina-deep">
            Preguntas frecuentes
          </h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-molina-ink">
                ¿Se puede separar el impuesto predial por cada predio?
              </dt>
              <dd className="mt-1 leading-6 text-molina-muted">
                No. El impuesto predial acumula el autoavalúo de todos los
                predios de un mismo propietario dentro del distrito.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-molina-ink">
                ¿Puedo pagar desde otra provincia?
              </dt>
              <dd className="mt-1 leading-6 text-molina-muted">
                Sí. Las liquidaciones pueden pagarse virtualmente desde
                cualquier lugar.
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={EXTERNAL_LINKS.mesaPartes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-molina-mint px-4 text-sm font-semibold text-white transition-colors hover:bg-molina-mint-light"
          >
            Solicitar por Mesa de Partes
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={EXTERNAL_LINKS.pagos}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-molina-teal px-4 text-sm font-semibold text-molina-teal transition-colors hover:bg-molina-teal hover:text-white"
          >
            Ir a pagos en línea
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </Modal>
  );
}

function MesaPartesPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<MesaPartesForm>({
    documentType: "DNI",
    documentNumber: "",
    subject: "",
    folios: 1,
    files: [],
  });
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...Array.from(fileList)],
    }));
  };

  const handleSubmit = () => {
    if (!form.documentNumber || !form.subject || form.files.length === 0)
      return;
    const folio = `MP-${Date.now().toString(36).toUpperCase()}`;
    setSubmitted(folio);
  };

  const reset = () => {
    setSubmitted(null);
    setForm({
      documentType: "DNI",
      documentNumber: "",
      subject: "",
      folios: 1,
      files: [],
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={reset}
      title="Mesa de Partes Virtual"
      description="Presentación de documentos con seguimiento por folio"
      className="lg:max-w-xl"
    >
      {submitted ? (
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-molina-mint" />
          <h3 className="mt-4 text-lg font-bold text-molina-deep">
            Documento registrado
          </h3>
          <p className="mt-2 text-sm text-molina-muted">
            Tu número de folio para seguimiento es:
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-molina-teal">
            {submitted}
          </p>
          <Button className="mt-6 w-full" onClick={reset}>
            Cerrar
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["DNI", "RUC"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, documentType: t }))
                }
                className={cn(
                  "flex-1 rounded-xl py-2 text-sm font-semibold",
                  form.documentType === t
                    ? "bg-molina-mint text-white"
                    : "bg-slate-100 text-molina-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Input
            label={`Número de ${form.documentType}`}
            value={form.documentNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, documentNumber: e.target.value }))
            }
          />
          <Input
            label="Asunto del documento"
            value={form.subject}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, subject: e.target.value }))
            }
          />
          <Input
            label="Número de folios"
            type="number"
            min={1}
            value={form.folios}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                folios: Math.max(1, Number(e.target.value)),
              }))
            }
          />

          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
              dragOver
                ? "border-molina-mint bg-emerald-50"
                : "border-slate-200 bg-slate-50",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="h-10 w-10 text-molina-muted" />
            <p className="mt-2 text-sm font-medium text-molina-ink">
              Arrastra tus archivos aquí
            </p>
            <p className="text-xs text-molina-muted">PDF, DOCX — máx. 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Seleccionar archivos
            </Button>
          </div>

          {form.files.length > 0 && (
            <ul className="space-y-1 text-sm">
              {form.files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="text-molina-muted">
                  {f.name} ({(f.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          )}

          <Button className="w-full" onClick={handleSubmit}>
            Enviar a Mesa de Partes
          </Button>
        </div>
      )}
    </Modal>
  );
}

function LicenciasPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [steps, setSteps] = useState<LicenseWizardStep[]>(LICENSE_STEPS_INITIAL);
  const [currentStep, setCurrentStep] = useState(0);

  const completeStep = () => {
    setSteps((prev) =>
      prev.map((s, i) => (i === currentStep ? { ...s, completed: true } : s)),
    );
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1);
    }
  };

  const allComplete = steps.every((s) => s.completed);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Licencias de Funcionamiento"
      description="Asistente paso a paso para tu solicitud"
      className="lg:max-w-xl"
    >
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "flex gap-4 rounded-xl border p-4 transition-colors",
              index === currentStep
                ? "border-molina-mint bg-emerald-50/50"
                : "border-slate-100",
            )}
          >
            {step.completed ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-molina-mint" />
            ) : index === currentStep ? (
              <Circle className="h-6 w-6 shrink-0 text-molina-mint fill-molina-mint/20" />
            ) : (
              <Circle className="h-6 w-6 shrink-0 text-slate-300" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-molina-ink">{step.title}</p>
              <p className="text-sm text-molina-muted">{step.description}</p>
              {index === currentStep && !step.completed && (
                <Button size="sm" className="mt-3" onClick={completeStep}>
                  Completar paso
                </Button>
              )}
            </div>
          </li>
        ))}
      </ol>

      {allComplete && (
        <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-molina-mint" />
          <p className="mt-2 font-semibold text-molina-deep">
            Solicitud lista para revisión
          </p>
          <Button className="mt-4 w-full">Enviar solicitud</Button>
        </div>
      )}
    </Modal>
  );
}
