import Link from "next/link";
import { SsoUserMenu } from "@/components/auth/SsoUserMenu";
import { MunicipalityLogo } from "@/components/ui/MunicipalityLogo";

export function PlataformaDigitalHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="shrink-0">
          <MunicipalityLogo variant="light" height={32} />
        </Link>
        <SsoUserMenu />
      </div>
    </header>
  );
}
