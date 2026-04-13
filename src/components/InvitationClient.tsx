// components/InvitationClient.tsx
"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import CalendarMonth from "@/components/CalendarMonth";
import GalleryCarousel from "@/components/GalleryCarousel";
import QuoteBlock from "@/components/QuoteBlock";
import TextBlock from "@/components/TextBlock";
import { Infinity, Coins } from "lucide-react";
import VenueBlock from "@/components/VenueBlock";
import Timeline from "@/components/Timeline";
import InfoCard from "@/components/InfoCard";
import BigDate from "@/components/BigDate";
import ConfirmCard from "@/components/ConfirmCard";
import dynamic from "next/dynamic";
import Image from "next/image";
import RevealSection from "@/components/RevealSection";
import DressCode from "@/components/DressCode";
import RecGiftsSection from "@/components/RecGiftsSection";
import BackgroundAudio from "@/components/BackgroundAudio";
import HeroCover from "@/components/HeroCover";

import {
  Great_Vibes,
  Cormorant_Garamond,
  Lora,
  Mr_De_Haviland,
  Mea_Culpa,
  Tangerine,
  Lavishly_Yours,
  Rouge_Script
} from "next/font/google";

type Family = { id: string; nombreFamilia: string; nroPersonas: number };
type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

const SOFT_BG_CARD = "#FFFFFF";
const SOFT_ACCENT = "#8FBFD9";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lora", display: "swap" });
const mr_de_haviland = Mr_De_Haviland({ subsets: ["latin"], weight: "400", variable: "--font-mrdehaviland", display: "swap" });
const mea_culpa = Mea_Culpa({ subsets: ["latin"], weight: "400", variable: "--font-meaculpa", display: "swap" });
const tangerine = Tangerine({ subsets: ["latin"], weight: "400", variable: "--font-tangerine", display: "swap" });
const lavishlyYours = Lavishly_Yours({ subsets: ["latin"], weight: "400", variable: "--font-lavishlyyours", display: "swap" });
const rougeScript = Rouge_Script({ subsets: ["latin"], weight: "400", variable: "--font-rougescript", display: "swap" });

const CountdownBanner = dynamic(() => import("@/components/CountdownBanner"), { ssr: false });

const WEDDING_DATE = new Date("2026-05-23T17:00:00");

const CHURCH_NAME = "Iglesia de San Roque, Cuenca";
const CHURCH_MAPS_URL = "https://maps.app.goo.gl/YRyZSh5wyinbugAH9";
const RECEPTION_NAME = "Quinta Pomelé, Cuenca";
const RECEPTION_MAPS_URL = "https://maps.app.goo.gl/hyzpdakVDWBAejcQA";

export default function InvitationClient({ familyIdFromUrl }: { familyIdFromUrl?: string }) {
  const [prefillFamily, setPrefillFamily] = React.useState<Family | undefined>(undefined);
  const [confirmed, setConfirmed] = React.useState(false);
  const [declined, setDeclined] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  const garlandVar: CSSVarProps<"--garland"> = { ["--garland"]: "clamp(110px,26vw,200px)" };

  // Lee estado desde el backend por familyId
  React.useEffect(() => {
    if (!familyIdFromUrl) { setChecking(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/guests?familyId=${encodeURIComponent(familyIdFromUrl)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/guests?familyId failed: ${res.status}`);
        const data = await res.json();

        // Normalización (acepta varios esquemas del backend):
        const rawStr = (data.status ?? data.rsvp ?? data.response ?? data.answer ?? "")
          .toString()
          .trim()
          .toLowerCase();
        const yesLike = ["si", "sí", "yes", "true"];
        const noLike = ["no", "false"];
        const responded = data.responded === true;
        const isYes =
          yesLike.includes(rawStr) ||
          data.status === "si" ||
          data.confirmed === true ||
          (responded && data.attending === true);

        const isNo =
          noLike.includes(rawStr) ||
          data.status === "no" ||
          data.declined === true ||
          (responded && data.attending === false);

        if (!cancelled) {
          setConfirmed(Boolean(isYes));
          setDeclined(Boolean(isNo) && !isYes);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  // Prefill de familia
  React.useEffect(() => {
    if (!familyIdFromUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/guests", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        const fam = list.find((f) => f.id === familyIdFromUrl);
        if (!cancelled) setPrefillFamily(fam);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [familyIdFromUrl]);

  return (
    <main
      className={`paper-invite relative h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar ${lora.className}`}
      style={{ overscrollBehaviorY: "contain" }}
    >
      <BackgroundAudio
        src="audio/theme.mp3"
        title="Nuestra canción"
        artist="Daniel & Nicole"
        cover="/assets/1.jpg"
      />

      <div className="mx-auto max-w-[640px]">
        {/* 1 — Hero */}
        <HeroCover src="/assets/1.jpg" alt="Daniel y Nicole">
          <div className="no-auto-resize">
            <h1 className={`text-center text-[64px] sm:text-[100px] ${mr_de_haviland.className} text-white drop-shadow`}>
              Daniel & Gabriela
            </h1>
            <p className={`mt-2 text-center text-white/90 text-[44px] sm:text-[50px] ${mr_de_haviland.className}`}>¡Nuestra Boda!</p>
          </div>

        </HeroCover>
        {/* 10 — Cita (hoja blanca) */}
        <RevealSection>
          <section className="relative ">
            <div
              className="mx-auto  max-w-[880px] overflow-hidden p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
              style={{
                ...garlandVar,
                background: "#FFFFFF",
              }}
            >
              <Image
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.95,
                }}
                priority={false}
              />
              <Image
                src="/blue_horizontal.png"
                alt=""
                aria-hidden
                width={320}
                height={120}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  bottom: "5%",
                  left: "50%",
                  transform: "translate(-50%, 30%)",
                  width: "var(--garland)",
                  height: "auto",
                  opacity: 0.95,
                }}
                priority={false}
              />
              <div className="relative z-10 py-6 text-center ">
                <QuoteBlock
                  classNameAuthor={`${cormorant.className} text-[15px] sm:text-[20px] py-3`}
                  classNameQuote={`${rougeScript.className} text-[25px] sm:text-[29px] pt-3`}
                  quote="El amor es paciente, es bondadoso. El amor no es envidioso, jactancioso ni orgulloso. No se comporta con rudeza, no es egoista, no se enoja fácilmente, no guarda rencor."
                  author="1 Corintios 13:4-5"
                />
              </div>
            </div>
          </section>
        </RevealSection>
        {/* 2 — Texto + BigDate + Countdown + CalendarMonth (panel baby blue) */}
        <RevealSection>
          <section
            className="relative px-4 sm:px-6 py-6 sm:py-8"
            style={{
              background: "linear-gradient(0deg, #F7FBFE 0%, #EFF7FD 100%)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            <div className="mx-auto w-full max-w-[560px] text-center">
              <TextBlock
                className={`bg-transparent shadow-none p-0`}
                paragraphClassName={`text-slate-700 text-center leading-[1.2] ${rougeScript.className}`}
                paragraphs={[
                  "Dios nos ha concedido el privilegio de conocernos y amarnos con su bendición y la de nuestros padres.",
                  "Queremos unir nuestras vidas para siempre y celebrarlo contigo.",
                ]}
              />

              <div className="mt-4">
                <BigDate
                  date={WEDDING_DATE}
                  tone="dark"
                  className={`mx-auto ${cormorant.className}`}
                  dayClassName={greatVibes.className}
                  labelsClassName={lora.className}
                />
              </div>

              <div className="mt-4">
                <CountdownBanner date={WEDDING_DATE} className="my-0" />
              </div>

              <div className="mt-6">
                <div className={`${lavishlyYours.className} text-4xl sm:text-5xl font-semibold text-slate-600`}>
                  El gran día
                </div>
                <div className="flex items-center justify-center gap-2 text-sm pt-4" style={{ color: SOFT_ACCENT }}>
                  <CalendarIcon className="size-4" />
                  <span className="uppercase tracking-wide">
                    {WEDDING_DATE.toLocaleDateString("es-ES", { month: "long" })}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <CalendarMonth
                  className="mx-auto w-full max-w-[520px]"
                  date={WEDDING_DATE}
                  highlightDate={WEDDING_DATE}
                  startOnSunday
                />
              </div>
            </div>
          </section>
        </RevealSection>

        {/* 3 — Info Padrinos (hoja blanca) */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
            ].join(" ")}
          >
            <div
              className="
                relative z-10 py-6 pb-3
                bg-white/85 ring-1 ring-white/60
                shadow-[0_12px_36px_rgba(15,23,42,0.06)]
                backdrop-saturate-150
              "
            >
              <Image
                src="/blue_leaves.png"
                alt=""
                aria-hidden
                width={360}
                height={360}
                className="pointer-events-none select-none absolute z-0"
                style={{
                  width: "var(--corner)",
                  height: "auto",
                  top: "calc(0.10 * var(--corner))",
                  left: "calc(-0.10 * var(--corner))",
                  transform: "rotate(15deg)",
                }}
                priority={false}
              />
              <div className="text-center">
                <div className="mx-auto flex max-w-fit items-center justify-center gap-1 text-sm font-medium">
                  <span className={`${mea_culpa.className} text-4xl sm:text-5xl font-semibold text-slate-600 pt-6`}>
                    Nuestros Padrinos
                  </span>
                </div>
              </div>

              <InfoCard
                title={<span className="pt-6">Padrinos de Arras</span>}
                titleClassName={`${mea_culpa.className} text-[34px] sm:text-[40px]`}
                icon={<Coins className="size-6" style={{ color: "#3579AD" }} />}
              >
                <p className={`${tangerine.className} text-[26px] sm:text-[30px]`}>
                  David Rojas & Jesica Armijos
                </p>
              </InfoCard>

              <InfoCard
                title={<span className="pt-6">Padrinos de Lazo</span>}
                titleClassName={`${mea_culpa.className} text-[34px] sm:text-[40px]`}
                icon={<Infinity className="size-6" style={{ color: "#3579AD" }} />}
              >
                <p className={`${tangerine.className} text-[26px] sm:text-[30px]`}>
                  René Castanier & María Palacios
                </p>
              </InfoCard>
            </div>
          </section>
        </RevealSection>
        {/* 6 — Imagen */}
        <RevealSection>
          <section className="grid gap-4">
            <div
              className="relative mt-0 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}
            >
              <Image src="/assets/3.jpg" alt="Momentos" fill sizes="100vw" className="object-cover" loading="lazy" />
            </div>
          </section>
        </RevealSection>
        {/* 4 — Venue */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative w-full px-4 sm:px-6",
              "pt-0 pb-0 sm:pt-0 sm:pb-0",
              "mb-0",
              "shadow-[0_4px_14px_rgba(0,0,0,0.04)]",
            ].join(" ")}
          >
            <div className="z-10 pb-9 py-9">
              <VenueBlock
                title="Ceremonia"
                name={CHURCH_NAME}
                address="Av Loja y Lorenzo Piedra, Cuenca"
                time="05:00 PM"
                mapUrl={CHURCH_MAPS_URL}
              />

              <div className="relative px-6 py-2 [--rose:clamp(90px,34vw,200px)] sm:[--rose:clamp(72px,22vw,180px)]">
                <Image
                  src="/blueroses.png"
                  alt=""
                  width={240}
                  height={240}
                  className="pointer-events-none select-none absolute z-20"
                  style={{
                    left: "calc(-0.20 * var(--rose))",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "var(--rose)",
                    height: "auto",
                  }}
                  priority={false}
                />
              </div>

              <VenueBlock
                title="Recepción"
                name={RECEPTION_NAME}
                address="Calle Cultura Pirincay - 3064 y Autopista Cuenca - Azogues"
                time="08:00 PM"
                mapUrl={RECEPTION_MAPS_URL}
              />
            </div>
          </section>
        </RevealSection>
        {/* 6 — Imagen */}
        <RevealSection>
          <section className="grid gap-4">
            <div
              className="relative mt-0 w-full aspect-[16/10] overflow-hidden"
              style={{ backgroundColor: SOFT_BG_CARD, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}
            >
              <Image
                src="/assets/10.jpg"
                alt="Momentos"
                fill sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </section>
        </RevealSection>

        {/* 5 — Timeline */}
        <RevealSection>
          <section
            className={[
              "[--corner:clamp(112px,38vw,260px)]",
              "sm:[--corner:clamp(52px,16vw,210px)]",
              "relative w-full",
              "px-4 sm:px-6 py-6 sm:py-8",        // padding más limpio
              "mt-0 mb-0",
              "overflow-x-hidden overflow-hidden",
            ].join(" ")}
            style={{
              background: "linear-gradient(0deg, #F7FBFE 0%, #EFF7FD 100%)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            <Timeline
              items={[
                { time: "5:00 PM", label: "Ceremonia", icon: "/assets/TimelineSVG/church.svg" },
                { time: "8:30 PM", label: "Recepción", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "6:00 PM", label: "Fotos", icon: "/assets/TimelineSVG/photos.svg" },
                { time: "9:00 PM", label: "Brindis & cena", icon: "/assets/TimelineSVG/lunch.svg" },
                { time: "10:00 PM", label: "Baile", icon: "/assets/TimelineSVG/disco.svg" },
              ]}
              className="px-3"
              title="Itinerario"
              titleClassName={`${greatVibes.className} text-3xl`}
              itemClassName={`${lora.className}`}
            />
          </section>
        </RevealSection>

        {/* 7 — DressCode */}
        <RevealSection>
          <DressCode
            titleClassName={`${mea_culpa.className} text-4xl`}
            captionClassName={`${rougeScript.className} text-[25px] sm:text-[29px]`}
            womenColors={[
              { color: "#1F4E7A" },
              { color: "#A9D6F5" },
              { color: "#BDE1F8" },
              { color: "#CAE7FA" },
            ]}

          />
        </RevealSection>
        {/* 9 — Carrusel */}
        <RevealSection>
          <section className="grid gap-3 [--garland:clamp(110px,26vw,200px)]">
            <GalleryCarousel
              aspect={4 / 3}
              images={[
                { src: "/assets/4.jpg", alt: "Foto 4" },
                { src: "/assets/5.jpg", alt: "Foto 5" },
                { src: "/assets/6.jpg", alt: "Foto 6" },
                { src: "/assets/7.jpg", alt: "Foto 7", objectPosition: "50% 30%" },
                { src: "/assets/9.jpg", alt: "Foto 9" },
                { src: "/assets/8.jpg", alt: "Foto 8", objectPosition: "50% 60%" },
              ]}
              className={`${cormorant.className} text-3xl`}
            />
          </section>
        </RevealSection>
        {/* 8 — Recomendaciones + Regalos */}
        <RevealSection>
          <RecGiftsSection
            className="pt-6"
            titleClassName={`${mea_culpa.className} text-4xl`}
            itemClassName={`${rougeScript.className} text-[26px] sm:text-[33px]`}
            accounts={[
              { bank: "Cooperativa Coopmego", holder: "Daniel Ulloa", account: "401010838242", dni: "1105002867" },
              { bank: "Banco de Loja", holder: "Daniel Ulloa", account: "2903926236", dni: "1105002867" },
              { bank: "Banco Pichincha", holder: "Daniel Ulloa", account: "2206132871", dni: "1105002867" },
            ]}
          />
        </RevealSection>

        {/* 11 — Confirmación — SOLO si hay id */}
        {familyIdFromUrl && (
          <RevealSection>
            <section>
              <ConfirmCard
                confirmed={confirmed}
                declined={declined}
                checking={checking}
                prefillFamilyId={familyIdFromUrl}
                prefillFamily={prefillFamily}
                onConfirmed={() => { setConfirmed(true); setDeclined(false); }}
                onDeclined={() => { setConfirmed(false); setDeclined(true); }}
                titleClassName={greatVibes.className}
                textClassName={lora.className}
                hideIfNoPrefill
                messageWhenConfirmed="¡Nos hace mucha ilusión compartir este día contigo! 💙"
                messageWhenDeclined="No hay problema, nos encontraremos en una siguiente ocasión"
              />
            </section>
          </RevealSection>
        )}

        {/* 12 — Cierre */}
        <RevealSection>
          <HeroCover src="/assets/11.jpg" alt="Nos vemos pronto" objectPosition="60% 20%">
            <h1 className={`text-center text-5xl sm:text-8xl ${greatVibes.className} text-white drop-shadow`}>
              ¡Nos vemos en la boda!
            </h1>
          </HeroCover>
        </RevealSection>
      </div>
    </main>
  );
}
