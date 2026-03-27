// components/VenueBlock.tsx
"use client";

import { Great_Vibes, Cormorant_Garamond } from "next/font/google";

const SOFT_BORDER = "#DBEAF5";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

type Props = {
  title?: string;      // ej: "Ceremonia"
  name: string;        // ej: "Parroquia San Juan..."
  address?: string;    // dirección
  time?: string;       // ej: "08:00 PM"
  mapUrl: string;
  className?: string;
};

export default function VenueBlock({
  title,
  name,
  address,
  time,
  mapUrl,
  className,
}: Props) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className="relative mx-auto w-full max-w-[520px] py-6">
        {/* Hoja trasera (ligeramente girada) */}
        <div
          aria-hidden
          className="absolute inset-x-3 top-3 bottom-3 rounded-2xl bg-white/85"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${SOFT_BORDER}`,
            boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
            transform: "rotate(-1.2deg)",
          }}
        />
        {/* Tarjeta principal */}
        <div
          className="relative rounded-2xl px-7 py-7 text-center bg-white"
          style={{
            border: `1px solid ${SOFT_BORDER}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {title && (
            <div
              className={`${greatVibes.className} text-[28px] sm:text-[34px] leading-none text-slate-700`}
            >
              {title}
            </div>
          )}

          {time && (
            <div
              className="mt-2 text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-slate-600"
            >
              {time}
            </div>
          )}

          <h3
            className={`${cormorant.className} mt-3 text-slate-800 uppercase text-[15px] sm:text-[18px]`}
            style={{ letterSpacing: "0.12em" }}
          >
            {name}
          </h3>

          {address && (
            <p className={`${cormorant.className} mt-3 text-sm text-slate-600 leading-relaxed`}>
              {address}
            </p>
          )}

          <div className="mt-5">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${name} en el mapa`}
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition"
              style={{
                backgroundColor: "#EAF3FB",
                border: `1px solid ${SOFT_BORDER}`,
                color: "#0F172A",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              Ver mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
