// components/ConfirmCard.tsx
"use client";

import * as React from "react";
import { CheckCircle2, CalendarCheck2, XCircle } from "lucide-react";
import RsvpButton from "@/components/RsvpButton";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };

export default function ConfirmCard({
  confirmed,
  declined = false,
  checking,
  prefillFamilyId,
  prefillFamily,
  onConfirmed,
  onDeclined,
  className,
  titleClassName,   // p.ej. greatVibes.className
  textClassName,    // p.ej. lora.className
  deadlineText = "Por favor confirma tu asistencia antes del 5 de diciembre de 2025",
  titleWhenOpen = "Confirmar asistencia",
  titleWhenDone = "¡Gracias por confirmar!",
  titleWhenDeclined = "¡Respuesta registrada!", // 👈 nuevo título para NO
  hideIfNoPrefill = true,
  messageWhenConfirmed = "¡Nos hace mucha ilusión compartir este día contigo! 💙",
  messageWhenDeclined = "No hay problema, nos encontraremos en una siguiente ocasión",
}: {
  confirmed: boolean;
  declined?: boolean;
  checking?: boolean;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  onConfirmed?: () => void;
  onDeclined?: () => void;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
  deadlineText?: string;
  titleWhenOpen?: string;
  titleWhenDone?: string;
  titleWhenDeclined?: string;
  hideIfNoPrefill?: boolean;
  messageWhenConfirmed?: string;
  messageWhenDeclined?: string;
}) {
  const hasPrefill = Boolean(prefillFamilyId || prefillFamily);
  if (hideIfNoPrefill && !hasPrefill) return null;

  const showForm = !confirmed && !declined;

  return (
    <section className={`w-full ${className ?? ""}`}>
      <div
        className="mx-auto w-full max-w-[520px] sm:max-w-[720px] px-6 py-8 text-center"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        {/* encabezado */}
        <div className="mx-auto grid place-items-center">
          <div
            className="grid place-items-center rounded-2xl"
            aria-hidden
            style={{ width: 48, height: 48, backgroundColor: "#F7FBFE" }}
          >
            {confirmed ? (
              <CheckCircle2 className="size-6" style={{ color: "#22C55E" }} />
            ) : declined ? (
              <XCircle className="size-6" style={{ color: "#ef4444" }} />
            ) : (
              <CalendarCheck2 className="size-6" style={{ color: "#3579AD" }} />
            )}
          </div>
        </div>

        <h3 className={`mt-4 text-4xl sm:text-5xl ${titleClassName ?? ""}`} style={{ color: "#0B1B2B" }}>
          {confirmed ? titleWhenDone : (declined ? titleWhenDeclined : titleWhenOpen)}
        </h3>

        {showForm ? (
          <>
            <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>{deadlineText}</p>

            {hasPrefill && !checking && (
              <div className="mt-5">
                <RsvpButton
                  triggerLabel="Confirmar"
                  prefillFamilyId={prefillFamilyId}
                  prefillFamily={prefillFamily}
                  greetingTemplate="{{nombre}}"
                  titleClassName={titleClassName}
                  textClassName={textClassName}
                  note="Nos encantará contar con tu presencia. Con su confirmación, nos ayudará a planificar mejor este día tan especial."
                  requirePrefill
                  onConfirmed={onConfirmed}
                  onDeclined={onDeclined}   // 👈 importante para NO
                />
              </div>
            )}

            <p className={`mt-3 text-xs text-slate-500 ${textClassName ?? ""}`} style={{ lineHeight: 1.4 }}>
              Si necesitas actualizar tu respuesta más adelante, contáctanos.
            </p>
          </>
        ) : confirmed ? (
          <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>
            {messageWhenConfirmed}
          </p>
        ) : (
          <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>
            {messageWhenDeclined}
          </p>
        )}
      </div>
    </section>
  );
}
