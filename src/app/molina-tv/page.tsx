import type { Metadata } from "next";
import { MolinaTvClient } from "./molina-tv-client";

export const metadata: Metadata = {
  title: "La Molina TV | Municipalidad de La Molina",
  description:
    "En vivo, sesiones de concejo, micronoticieros y podcasts oficiales de La Molina TV.",
};

export default function MolinaTvPage() {
  return <MolinaTvClient />;
}
