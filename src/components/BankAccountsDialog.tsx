// components/BankAccountsDialog.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Check, Banknote, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";
const SOFT_TEXT = "#0F172A";
const BABY_BLUE_TOP = "#F7FBFE";
const BABY_BLUE_BOTTOM = "#EFF7FD";

const CORNER_TOP = "/blueleaves.png";
const CORNER_BOTTOM = "/blueroses.png";

export type BankAccount = {
  bank: string;
  holder: string;
  account: string;
  dni: string;
  qr?: string; // 👈 NUEVO: ruta/URL de imagen QR propia de la cuenta
};

export default function BankAccountsDialog({
  open,
  onOpenChange,
  accounts,
  title = "Cuentas para regalo",
  description = "Gracias por tu cariño. Puedes usar cualquiera de estas cuentas:",
  titleClassName,
  textClassName,
  onShowQR, // 👈 NUEVO: callback para mostrar el QR
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accounts: BankAccount[];
  title?: string;
  description?: string;
  /** opcional, para combinar tipografías como en RsvpButton */
  titleClassName?: string;
  textClassName?: string;
  onShowQR?: (account: BankAccount) => void; // 👈 NUEVO
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl rounded-[28px] p-0 overflow-hidden"
        style={{
          borderColor: SOFT_BORDER,
          background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
        }}
      >
        {/* adornos */}
        <Image
          src={CORNER_TOP}
          alt=""
          width={192}
          height={192}
          aria-hidden
          className="pointer-events-none select-none absolute right-[-08%] top-[-10%]"
          style={{ transform: "rotate(8deg)", opacity: 0.9, width: "10rem", height: "auto" }}
          priority={false}
        />
        <Image
          src={CORNER_BOTTOM}
          alt=""
          width={192}
          height={192}
          aria-hidden
          className="pointer-events-none select-none absolute left-[-10%] bottom-[-08%]"
          style={{ transform: "rotate(180deg)", opacity: 0.9, width: "10rem", height: "auto" }}
          priority={false}
        />

        {/* header */}
        <DialogHeader className="pt-6 pb-2 text-center">
          <div
            className="mx-auto grid place-items-center size-11 rounded-2xl border bg-white"
            style={{ borderColor: SOFT_BORDER }}
          >
            <Banknote className="size-5" style={{ color: SOFT_ACCENT }} />
          </div>
          <DialogTitle
            className={`mt-3 text-3xl tracking-wide text-center ${titleClassName ?? ""}`}
            style={{ color: SOFT_TEXT }}
          >
            {title}
          </DialogTitle>
          <DialogDescription className={`mt-1 text-sm text-slate-700 text-center ${textClassName ?? ""}`}>
            {description}
          </DialogDescription>
          <div className="mx-auto mt-3 h-px w-24" style={{ backgroundColor: SOFT_BORDER }} />
        </DialogHeader>

        {/* contenido */}
        <div className="relative z-10 px-5 pb-6">
          <ul className="grid gap-4 sm:grid-cols-2">
            {accounts.map((acc, i) => (
              <li
                key={i}
                className="rounded-2xl border bg-white/90 p-4 sm:p-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
                style={{ borderColor: SOFT_BORDER }}
              >
                <div className="mb-2 text-base font-semibold text-slate-800">{acc.bank}</div>

                <FieldRow label="Titular" value={acc.holder} textClassName={textClassName} />
                <FieldRow label="Nro. de cuenta" value={acc.account} copyable textClassName={textClassName} />
                <FieldRow label="DNI" value={acc.dni} copyable textClassName={textClassName} />

                <div className="mt-4 flex flex-wrap gap-2">
                  <CopyAllButton acc={acc} />
                  {acc.qr && (
                    <Button
                      type="button"
                      className="rounded-xl"
                      onClick={() => onShowQR?.(acc)}
                      style={{
                        background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
                        border: `1px solid ${SOFT_BORDER}`,
                        color: SOFT_TEXT,
                        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                      }}
                    >
                      <QrCode className="mr-2 size-4" />
                      Ver QR
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({
  label,
  value,
  copyable = false,
  textClassName,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  textClassName?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className={`text-sm ${textClassName ?? ""}`}>
        <span className="text-slate-500">{label}:</span>{" "}
        <span className="font-medium text-slate-900">{value}</span>
      </div>

      {copyable && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-xl"
          onClick={handleCopy}
          aria-label={`Copiar ${label}`}
          style={{
            background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
            borderColor: SOFT_BORDER,
            color: SOFT_TEXT,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      )}
    </div>
  );
}

function CopyAllButton({ acc }: { acc: BankAccount }) {
  const [copied, setCopied] = React.useState(false);
  const text = `Banco: ${acc.bank}\nTitular: ${acc.holder}\nCuenta: ${acc.account}\nDNI: ${acc.dni}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <Button
      onClick={handleCopy}
      className="rounded-xl"
      style={{
        background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
        border: `1px solid ${SOFT_BORDER}`,
        color: SOFT_TEXT,
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
      }}
    >
      {copied ? (
        <>
          <Check className="mr-2 size-4" /> Copiado
        </>
      ) : (
        <>
          <Copy className="mr-2 size-4" /> Copiar datos
        </>
      )}
    </Button>
  );
}
