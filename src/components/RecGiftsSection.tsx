// components/RecGiftsSection.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Gift, Sparkles, Banknote } from "lucide-react";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import BankAccountsDialog, { type BankAccount } from "@/components/BankAccountsDialog";
import QRImageDialog from "@/components/QRImageDialog";

const SOFT_BTN_BG = "#EAF3FB";
const SOFT_BTN_BG_HOVER = "#E1EEF8";
const SOFT_TEXT = "#0F172A";

type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

export default function RecGiftsSection({
  recommendations = "Llega con anticipación y sigue las indicaciones del personal del lugar para asegurar una experiencia agradable para todos.",
  gifts = "Tu presencia es lo más valioso para nosotros. Si deseas hacernos un regalo, hemos preparado algunas opciones para facilitarte el proceso.",
  registryLabel,
  registryUrl,
  accounts = [],
  className,
  titleClassName,
  itemClassName,
}: {
  recommendations?: string;
  gifts?: string;
  registryLabel?: string;
  registryUrl?: string;
  accounts?: BankAccount[];
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedQR, setSelectedQR] = React.useState<string | null>(null); // 👈 NUEVO
  const lilyVarStyle: CSSVarProps<"--lily"> = { ["--lily"]: "clamp(320px,32vw,360px)" };

  return (
    <section
      className={[
        "relative overflow-visible w-full px-3",
        "[--corner:clamp(120px,22vw,120px)]",
        "sm:[--corner:clamp(84px,16vw,180px)]",
        className ?? "",
      ].join(" ")}
    >
      <Image
        src="/blueleaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="pointer-events-none select-none absolute z-0 sm:top-[calc(-0.01_*_var(--corner))] right-[calc(-0.30_*_var(--corner))]"
        style={{ width: "var(--corner)", height: "auto" }}
        priority={false}
      />

      <div className="relative z-10 mx-auto grid max-w-[880px] gap-6">
        <InfoCard
          title={<span className={titleClassName}>{`Recomendaciones`}</span>}
          icon={<Sparkles className="size-6" style={{ color: "#3579AD" }} />}
        >
          <p className={itemClassName}>{recommendations}</p>
        </InfoCard>

        <div className="relative flex items-center justify-center" style={lilyVarStyle}>
          <Image
            src="/blueflower_horizontal.png"
            alt=""
            width={640}
            height={200}
            aria-hidden
            className="pointer-events-none select-none"
            style={{ width: "var(--lily)", height: "auto" }}
            priority={false}
          />
        </div>

        <InfoCard
          title={<span className={titleClassName}>{`Regalos`}</span>}
          icon={<Gift className="size-6" style={{ color: "#3579AD" }} />}
        >
          <p className={itemClassName}>{gifts}</p>

          <div className={`mt-4 flex items-center justify-center gap-3 flex-wrap text-center ${itemClassName ?? ""}`}>
            {accounts.length > 0 && (
              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl px-5 py-2 w-auto text-[19px] sm:text-[25px]"
                style={{
                  backgroundColor: SOFT_BTN_BG,
                  color: SOFT_TEXT,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SOFT_BTN_BG_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SOFT_BTN_BG)}
              >
                <Banknote className="mr-2 size-4" />
                Ver cuentas
              </Button>
            )}

            {registryUrl && (
              <a
                href={registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition"
                style={{
                  backgroundColor: SOFT_BTN_BG,
                  color: SOFT_TEXT,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                {registryLabel ?? "Ver mesa de regalos"}
              </a>
            )}
          </div>
        </InfoCard>
      </div>

      {accounts.length > 0 && (
        <BankAccountsDialog
          open={open}
          onOpenChange={setOpen}
          accounts={accounts}
          title="Cuentas para regalo"
          description="Puedes copiar los datos que necesites. ¡Gracias!"
          onShowQR={(acc) => acc.qr && setSelectedQR(acc.qr)} // 👈 abre el QR correspondiente
        />
      )}

      {selectedQR && (
        <QRImageDialog
          open={!!selectedQR}
          onOpenChange={(o) => !o && setSelectedQR(null)}
          src={selectedQR}
          title="Pagar con QR"
          description="Escanéalo con tu app bancaria o wallet."
        />
      )}
    </section>
  );
}
