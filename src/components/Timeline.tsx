// components/Timeline.tsx
"use client";

import Image from "next/image";
import * as React from "react";

// --- Paleta de colores ajustada al tema Baby Blue / Gris ---
const LINE_COLOR = "#9CB4CC"; // Azul pastel suave / Baby blue grisáceo
const TEXT_COLOR = "#4B5563"; // Gris frío (Slate/Cool Gray) para armonizar

type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

export type Item = {
  time: string;
  label: string;
  icon?: string;
};

export default function Timeline({
  items = [],
  title,
  className,
  titleClassName,
  itemClassName,
}: {
  items?: Item[];
  title?: string;
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  
  // Tamaño reducido para las flores (Se mantiene igual)
  const cornerVarStyle: CSSVarProps<"--corner"> = {
    ["--corner"]: "clamp(80px, 20vw, 160px)", 
  };

  return (
    <section 
      className={`relative w-full ${className ?? ""}`} 
      style={{ 
        ...cornerVarStyle,
      }}
    >
      {title && (
        <div className="mb-8 text-center relative z-10 pt-8">
          <div
            className={`tracking-wide mt-3 ${titleClassName ?? ""}`}
            style={{
              fontSize: "clamp(32px, 7vw, 54px)",
              lineHeight: 1.06,
              color: TEXT_COLOR 
            }}
          >
            {title}
          </div>
        </div>
      )}

      {/* FLORES DECORATIVAS */}
      <Image
        src="/timelineflower1.png"
        alt=""
        width={300}
        height={300}
        aria-hidden
        className="pointer-events-none select-none absolute z-0 bottom-[-20px] right-[-10px] "
        style={{ 
          width: "calc(0.90 * var(--corner))", 
          height: "auto",
          rotate: "360deg", 
        }}
        priority={false}
      />
      <Image
        src="/timelineflower1.png"
        alt=""
        width={300}
        height={300}
        aria-hidden
        className="pointer-events-none select-none absolute z-0 top-[-10px] left-[-10px] sm:top-[-10px]"
        style={{ 
          width: "calc(0.90 * var(--corner))", 
          height: "auto",
          rotate: "180deg",
        }}
        priority={false} 
      />

      <div className="relative mx-auto w-full max-w-[980px] px-2 sm:px-4 overflow-hidden">
        
        {/* LÍNEA VERTICAL CENTRAL CONTINUA */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 z-0"
          style={{ backgroundColor: LINE_COLOR }}
        >
          {/* Puntito superior único */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: LINE_COLOR }}
          />
        </div>

        {/* LISTA DE ITEMS */}
        <ol className="relative z-10 mx-auto w-full max-w-[900px] flex flex-col mt-4 pb-12">
          {safeItems.map((it, i) => (
            <TimelineRow
              key={i}
              time={it.time}
              label={it.label}
              icon={it.icon}
              itemClassName={itemClassName}
              index={i} 
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

// --- SUB-COMPONENTE ROW ---
function TimelineRow({
  time,
  label,
  icon,
  itemClassName,
  index,
}: {
  time: string;
  label: string;
  icon?: string;
  itemClassName?: string;
  index: number;
}) {
  // CORRECCIÓN: Se aumentó el tamaño mínimo y máximo de los iconos
  const iconSize = "clamp(45px, 9vw, 65px)"; 
  const timeSize = "clamp(12px, 3.2vw, 15px)";
  const labelSize = "clamp(10px, 2.5vw, 13px)";

  const isRightSide = index % 2 === 0;

  return (
    <li className="relative grid grid-cols-2 w-full items-center mt-4 sm:mt-8 first:mt-0">
      
      {/* MITAD IZQUIERDA */}
      <div className="flex w-full">
        {!isRightSide && (
          <div className="w-full pl-2 sm:pl-16 pr-0 flex flex-col">
            
            <div 
              className="flex flex-col items-center w-full pb-3"
              style={{ borderBottom: `1.5px dashed ${LINE_COLOR}` }}
            >
              {icon && (
                <div className="relative shrink-0 mb-3">
                  <Image 
                    src={icon} 
                    // CORRECCIÓN: Se actualizó el width y height base para evitar pérdida de calidad
                    width={75} 
                    height={75} 
                    alt="" 
                    aria-hidden 
                    className="block" 
                    style={{ width: iconSize, height: iconSize }} 
                    priority={false}
                  />
                </div>
              )}
              <span 
                className={`uppercase tracking-[0.15em] text-center leading-tight ${itemClassName ?? ""}`} 
                style={{ fontSize: labelSize, color: TEXT_COLOR }}
              >
                {label}
              </span>
            </div>

            <div className="w-full pt-2.5 pb-2 flex justify-center">
              <span
                className="tracking-widest"
                style={{ color: TEXT_COLOR, fontSize: timeSize }}
              >
                {time}
              </span>
            </div>

          </div>
        )}
      </div>

      {/* MITAD DERECHA */}
      <div className="flex w-full">
        {isRightSide && (
          <div className="w-full pr-2 sm:pr-16 pl-0 flex flex-col">
            
            <div 
              className="flex flex-col items-center w-full pb-3"
              style={{ borderBottom: `1.5px dashed ${LINE_COLOR}` }}
            >
              {icon && (
                <div className="relative shrink-0 mb-3">
                  <Image 
                    src={icon} 
                    // CORRECCIÓN: Se actualizó el width y height base para evitar pérdida de calidad
                    width={75} 
                    height={75} 
                    alt="" 
                    aria-hidden 
                    className="block" 
                    style={{ width: iconSize, height: iconSize }} 
                    priority={false}
                  />
                </div>
              )}
              <span 
                className={`uppercase tracking-[0.15em] text-center leading-tight ${itemClassName ?? ""}`} 
                style={{ fontSize: labelSize, color: TEXT_COLOR }}
              >
                {label}
              </span>
            </div>

            <div className="w-full pt-2.5 pb-2 flex justify-center">
              <span
                className="tracking-widest"
                style={{ color: TEXT_COLOR, fontSize: timeSize }}
              >
                {time}
              </span>
            </div>

          </div>
        )}
      </div>

    </li>
  );
}