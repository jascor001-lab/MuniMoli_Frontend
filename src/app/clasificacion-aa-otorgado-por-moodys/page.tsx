import type { Metadata } from "next";
import { MoodysAaClient } from "./moodys-aa-client";

export const metadata: Metadata = {
  title: "Clasificación AA− otorgado por Moody's | Municipalidad de La Molina",
  description:
    "Información sobre la clasificación crediticia AA− otorgada por Moody's Local a la Municipalidad Distrital de La Molina: qué significa y cómo beneficia a los vecinos.",
};

export default function MoodysAaPage() {
  return <MoodysAaClient />;
}
