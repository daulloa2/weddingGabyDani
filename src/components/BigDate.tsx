// components/BigDate.tsx
"use client";

import * as React from "react";

const MONTHS = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
  "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
];
const WEEKDAYS = [
  "DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"
];

export default function BigDate({
  date,
  className,
  dayClassName,
  labelsClassName,
  tone = "dark", // "dark" sobre fondo claro, "light" sobre fondo oscuro
}: {
  date: Date | string | number;
  className?: string;
  dayClassName?: string;
  labelsClassName?: string;
  tone?: "light" | "dark";
}) {
  const d = new Date(date);
  const year = d.getFullYear();
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const dow = WEEKDAYS[d.getDay()];

  const mutedColor  = tone === "light" ? "rgba(255,255,255,0.70)" : "rgba(15,23,42,0.70)";
  const hairlineCol = tone === "light" ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.18)";

  return (
    <section className={`w-full text-center ${className ?? ""}`} >
      {/* Mes */}
      <div
        className={`uppercase tracking-[0.35em] text-[11px] sm:text-xs ${labelsClassName ?? ""}`}
        style={{ color: mutedColor }}
      >
        {month}
      </div>

      {/* Fila en grid: 1fr | auto | 1fr para centrar el día */}
      <div
        className="mt-2 grid items-center gap-5 sm:gap-8"
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
      >
        {/* SÁBADO (alineado hacia el centro, con borde arriba/abajo) */}
        <span
          className={`justify-self-end inline-block px-3 py-1 whitespace-nowrap uppercase tracking-[0.3em] text-[10px] sm:text-xs ${labelsClassName ?? ""}`}
          style={{
            color: mutedColor,
            borderTop: `1px solid ${hairlineCol}`,
            borderBottom: `1px solid ${hairlineCol}`,
          }}
        >
          {dow}
        </span>

        {/* Día grande — SIEMPRE centrado */}
        <span
          className={`leading-none font-light text-blue-950/90 ${dayClassName ?? ""}`}
          style={{ fontSize: "clamp(64px, 16vw, 120px)", lineHeight: 0.9 }}
          aria-label={`Día ${day}`}
        >
          {day}
        </span>

        {/* 2025 (alineado hacia el centro, con borde arriba/abajo) */}
        <span
          className={`justify-self-start inline-block px-3 py-1 whitespace-nowrap uppercase tracking-[0.3em] text-[10px] sm:text-xs ${labelsClassName ?? ""}`}
          style={{
            color: mutedColor,
            borderTop: `1px solid ${hairlineCol}`,
            borderBottom: `1px solid ${hairlineCol}`,
          }}
        >
          {year}
        </span>
      </div>
    </section>
  );
}
