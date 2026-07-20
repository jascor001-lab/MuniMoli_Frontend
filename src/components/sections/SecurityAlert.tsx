"use client";

import { useState } from "react";
import { Phone, Shield, Siren, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

export function SecurityAlert() {
  const [panicActive, setPanicActive] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handlePanic = () => {
    setPanicActive(true);
    setTimeout(() => setPanicActive(false), 5000);
  };

  const handleReport = () => {
    setReportSent(true);
    setTimeout(() => setReportSent(false), 4000);
  };

  return (
    <section
      id="seguridad"
      className="scroll-mt-24 py-16 lg:py-24"
      aria-labelledby="security-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-700 shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 text-red-100">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Seguridad Ciudadana
                </span>
              </div>
              <h2
                id="security-heading"
                className="mt-3 text-3xl font-bold text-white lg:text-4xl"
              >
                Alerta La Molina
              </h2>
              <p className="mt-4 text-red-50/90">
                Reporta incidentes en tiempo real o activa el botón de
                emergencia para contacto inmediato con Serenazgo del distrito.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handlePanic}
                  className="bg-white text-red-700 hover:bg-red-50"
                >
                  <Siren className="h-5 w-5" />
                  Botón de emergencia
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReport}
                  className="border-white/50 text-white hover:bg-white/10"
                >
                  <MapPin className="h-5 w-5" />
                  Reportar incidente
                </Button>
              </div>

              {reportSent && (
                <p
                  className="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm text-white"
                  role="status"
                >
                  Reporte enviado. Serenazgo se comunicará contigo en breve.
                </p>
              )}
            </div>

            <div className="bg-red-800/40 p-8 lg:p-12">
              <h3 className="font-bold text-white">Contacto Serenazgo</h3>
              <ul className="mt-4 space-y-4">
                {[
                  { label: "Central Serenazgo", number: "(01) 368-9200" },
                  { label: "Emergencias", number: "116" },
                  { label: "Comisaría PNP La Molina", number: "(01) 368-9300" },
                ].map((contact) => (
                  <li key={contact.number}>
                    <a
                      href={`tel:${contact.number.replace(/\D/g, "")}`}
                      className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/20"
                    >
                      <Phone className="h-5 w-5 text-white" />
                      <div>
                        <p className="text-xs text-red-100">{contact.label}</p>
                        <p className="font-bold text-white">{contact.number}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Patrullaje inteligente",
              desc: "Cámaras y rutas optimizadas en zonas de alta afluencia.",
            },
            {
              title: "App ciudadana",
              desc: "Próximamente: seguimiento de reportes desde tu celular.",
            },
            {
              title: "Comunidad vigilante",
              desc: "Programas vecinales de prevención y alerta temprana.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <h4 className="font-bold text-molina-deep">{item.title}</h4>
                <p className="mt-1 text-sm text-molina-muted">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        open={panicActive}
        onClose={() => setPanicActive(false)}
        title="Emergencia activada"
        description="Simulación de alerta — En producción conectaría con central Serenazgo"
      >
        <div className="flex flex-col items-center py-4 text-center">
          <Siren className="h-16 w-16 animate-pulse text-red-600" />
          <p className="mt-4 font-semibold text-molina-ink">
            Conectando con Serenazgo La Molina...
          </p>
          <p className="mt-2 text-sm text-molina-muted">
            Mantén la calma. Tu ubicación sería compartida automáticamente.
          </p>
          <a href="tel:013689200" className="mt-6">
            <Button variant="danger" className="w-full">
              Llamar (01) 368-9200
            </Button>
          </a>
        </div>
      </Modal>
    </section>
  );
}
