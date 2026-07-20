import type { Metadata } from "next";
import { ContactoPageClient } from "./contacto-client";

export const metadata: Metadata = {
  title: "Contáctanos | Municipalidad de La Molina",
  description:
    "Atención al vecino: sede, horarios, central telefónica, teléfonos de emergencia y redes sociales de la Municipalidad Distrital de La Molina.",
};

export default function ContactoPage() {
  return <ContactoPageClient />;
}
