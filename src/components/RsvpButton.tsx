// components/RsvpButton.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, CalendarHeart, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";
const SOFT_TEXT = "#0F172A";
const BABY_BLUE_TOP = "#F7FBFE";
const BABY_BLUE_BOTTOM = "#EFF7FD";

const CORNER_TOP = "/blueleaves.png";
const CORNER_BOTTOM = "/blueroses.png";

type Family = { id: string; nombreFamilia: string; nroPersonas: number; invitados?: { adult?: number; kids?: number; total?: number }; };

function personasLabel(n?: number) {
  if (typeof n !== "number") return "";
  return n === 1 ? "1 persona" : `${n} personas`;
}

function asistiranLabel(n?: number) {
  if (typeof n !== "number") return "";
  return n === 1 ? "¿Asistirás?" : `¿Asistirán?`;
}

export default function RsvpButton({
  triggerClassName = "",
  triggerLabel = "Confirmar",
  prefillFamilyId,
  prefillFamily,
  confirmed,
  onConfirmed,
  onDeclined, // 👈 NUEVO
  greetingTemplate = "Estimad@ {{nombre}}",
  note,
  titleClassName,
  textClassName,
  requirePrefill = true,
  successYesMessage = "¡Qué emoción, nos vemos en la boda! 💙",
  successNoMessage = "No hay problema, nos encontraremos en una siguiente ocasión",
}: {
  triggerClassName?: string;
  triggerLabel?: string;
  prefillFamilyId?: string;
  prefillFamily?: Family;
  confirmed?: boolean;
  onConfirmed?: () => void;
  onDeclined?: () => void; // 👈 NUEVO
  greetingTemplate?: string;
  note?: string;
  titleClassName?: string;
  textClassName?: string;
  requirePrefill?: boolean;
  successYesMessage?: string;
  successNoMessage?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [families, setFamilies] = React.useState<Family[]>([]);
  const [familyId, setFamilyId] = React.useState(prefillFamily?.id ?? "");
  const [attendance, setAttendance] = React.useState<"si" | "no">("si");
  const [loadingFamilies, setLoadingFamilies] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadedOnce, setLoadedOnce] = React.useState(false);

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successData, setSuccessData] = React.useState<
    null | { nombreFamilia: string; nroPersonas: number; asistencia: boolean }
  >(null);
  const SOFT_BTN_BG = "#EAF3FB";
  const [alreadyResponded, setAlreadyResponded] = React.useState(false);
  const [checkingStatus, setCheckingStatus] = React.useState(false);

  const hasPrefill = Boolean(prefillFamily || prefillFamilyId);
  const selected: Family | null =
    families.find((f) => f.id === familyId) || prefillFamily || null;

  // tratado como "ya respondió" (para ocultar trigger)
  const isConfirmed = (confirmed ?? alreadyResponded) === true;

  // Autochequeo de elegibilidad
  React.useEffect(() => {
    if (!hasPrefill) return;
    if (confirmed !== undefined) return;
    const id = prefillFamily?.id ?? prefillFamilyId!;
    let cancelled = false;

    (async () => {
      try {
        setCheckingStatus(true);
        const res = await fetch("/api/rsvp/eligible", { cache: "no-store" });
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        const stillEligible = list.some((f) => f.id === id);
        if (!cancelled) setAlreadyResponded(!stillEligible);
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    })();

    return () => { cancelled = true; };
  }, [hasPrefill, confirmed, prefillFamily, prefillFamilyId]);

  // Carga de familias (sin prefill)
  React.useEffect(() => {
    if (!open || loadedOnce || hasPrefill || requirePrefill) return;
    (async () => {
      try {
        setLoadingFamilies(true);
        const res = await fetch("/api/rsvp/eligible", { cache: "no-store" });
        const data = await res.json();
        const list: Family[] = data.families ?? [];
        setFamilies(list);
      } finally {
        setLoadingFamilies(false);
        setLoadedOnce(true);
      }
    })();
  }, [open, loadedOnce, hasPrefill, requirePrefill]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || isConfirmed) return;
    setSubmitting(true);
    try {
      const asistenciaBool = attendance === "si";
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: selected.id,
          nombreFamilia: selected.nombreFamilia,
          nroPersonas: selected.nroPersonas,
          asistencia: asistenciaBool,
          adultos: Number.isFinite(selected?.invitados?.adult as number)
            ? selected!.invitados!.adult
            : undefined,
          ninos: Number.isFinite(selected?.invitados?.kids as number)
            ? selected!.invitados!.kids
            : undefined,
        }),
      });

      if (res.status === 409) {
        // Ya habían respondido (desconocemos si fue sí/no) → no llamar callbacks
        setFamilies((prev) => prev.filter((f) => f.id !== selected.id));
        setFamilyId("");
        setAlreadyResponded(true);
        setOpen(false);
        return;
      }
      if (!res.ok) throw new Error(await res.text());

      // Éxito
      setFamilies((prev) => prev.filter((f) => f.id !== selected.id));
      setFamilyId("");
      setOpen(false);
      setSuccessData({
        nombreFamilia: selected.nombreFamilia,
        nroPersonas: selected.nroPersonas,
        asistencia: asistenciaBool,
      });

      setAlreadyResponded(true);

      // 👇 callback correcto según la elección
      if (asistenciaBool) onConfirmed?.();
      else onDeclined?.();

      setTimeout(() => setSuccessOpen(true), 0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const noneLeft = loadedOnce && !loadingFamilies && families.length === 0;
  const shouldHide =
    (requirePrefill && !hasPrefill) ||
    (hasPrefill && (isConfirmed || checkingStatus));
  if (shouldHide) return null;

  const displayName = selected?.nombreFamilia ?? "__________";
  const greeting = greetingTemplate.replace("{{nombre}}", displayName);

  return (
    <>
      {/* Trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl px-5 py-2 w-auto text-[15px] sm:text-[15px]"
                style={{
                  backgroundColor: SOFT_BTN_BG,
                  color: SOFT_TEXT,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  borderColor: SOFT_BORDER
                }}
            disabled={noneLeft}
            title={noneLeft ? "Ya no hay familias pendientes" : ""}
          >
            {noneLeft ? "Sin pendientes" : triggerLabel}
          </Button>
        </DialogTrigger>

        {/* Modal */}
        <DialogContent
          className="sm:max-w-lg rounded-[28px] p-0 overflow-hidden"
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
            className="pointer-events-none select-none absolute right-[-10%] top-[-8%]"
            style={{ transform: "rotate(8deg)", opacity: 0.9, width: "10rem", height: "auto" }}
            priority={false}
          />
          <Image
            src={CORNER_BOTTOM}
            alt=""
            width={192}
            height={192}
            aria-hidden
            className="pointer-events-none select-none absolute left-[-8%] bottom-[-10%]"
            style={{ transform: "rotate(180deg)", opacity: 0.9, width: "10rem", height: "auto" }}
            priority={false}
          />

          {/* header */}
          <DialogHeader className="pt-6 pb-2 text-center">
            <div
              className="mx-auto grid place-items-center size-11 rounded-2xl border bg-white"
              style={{ borderColor: SOFT_BORDER }}
            >
              <CalendarHeart className="size-5" style={{ color: SOFT_ACCENT }} />
            </div>
            <DialogTitle
              className={`mt-3 text-6xl tracking-wide text-center ${titleClassName ?? ""}`}
              style={{ color: SOFT_TEXT }}
            >
              Para:
              <div className={`mt-1 text-4xl ${titleClassName ?? ""}`} style={{ color: SOFT_TEXT }}>
                {greeting}
              </div>

              {typeof selected?.invitados?.total === "number" && (
                <div className={`mt-1 text-xl ${titleClassName ?? ""}`} style={{ color: SOFT_TEXT }}>
                  Pase válido para {personasLabel(selected.invitados?.total)}
                </div>
              )}
            </DialogTitle>
            <div className="mx-auto mt-2 h-px w-24" style={{ backgroundColor: SOFT_BORDER }} />
          </DialogHeader>

          {/* contenido */}
          <div className="px-5 pb-6">
            {loadingFamilies ? (
              <div className="text-sm text-slate-600">Cargando familias…</div>
            ) : noneLeft && !selected ? (
              <div className="text-sm text-slate-600">No hay familias pendientes por responder.</div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="px-4 py-4 text-center">
                  {note && (
                    <p className={`mt-2 text-sm text-slate-600 ${textClassName ?? ""}`}>{note}</p>
                  )}
                </div>

                {!requirePrefill && !hasPrefill && (
                  <div className="grid gap-2">
                    <Label className={`text-slate-700 ${textClassName ?? ""}`}>Familia</Label>
                    <Select value={familyId} onValueChange={setFamilyId}>
                      <SelectTrigger className="rounded-xl bg-white" style={{ borderColor: SOFT_BORDER }}>
                        <SelectValue placeholder="Selecciona tu familia" />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nombreFamilia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label className={`text-slate-700 text-2xl ${titleClassName ?? ""}`}>
                  {asistiranLabel(selected?.invitados?.total)}</Label>

                  <RadioGroup
                    value={attendance}
                    onValueChange={(v: "si" | "no") => setAttendance(v)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {(["si", "no"] as const).map((val) => {
                      const selectedPill = attendance === val;
                      return (
                        <label
                          key={val}
                          htmlFor={`asist-${val}`}
                          className="group relative flex cursor-pointer select-none items-center gap-3 rounded-2xl border px-4 py-3 transition"
                          style={{
                            background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
                            borderColor: selectedPill ? SOFT_ACCENT : SOFT_BORDER,
                            boxShadow: selectedPill ? `0 0 0 3px ${SOFT_ACCENT}22` : "none",
                          }}
                        >
                          <RadioGroupItem id={`asist-${val}`} value={val} className="sr-only" />
                          {val === "si" ? (
                            <CheckCircle2
                              className="size-5"
                              style={{ color: selectedPill ? SOFT_ACCENT : "#94a3b8" }}
                              aria-hidden
                            />
                          ) : (
                            <XCircle
                              className="size-5"
                              style={{ color: selectedPill ? SOFT_ACCENT : "#94a3b8" }}
                              aria-hidden
                            />
                          )}
                          <span className={`text-sm ${textClassName ?? ""}`}>
                            {val === "si" ? "Sí" : "No"}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>

                <DialogFooter className="pt-1">
                  <div className="w-full flex justify-center">
                    <Button
                      type="submit"
                      disabled={!selected || submitting}
                      className="rounded-2xl px-5 py-2 text-sm font-semibold"
                      style={{
                        background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
                        border: `1px solid ${SOFT_BORDER}`,
                        color: SOFT_TEXT,
                        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
                      }}
                    >
                      {submitting ? "Enviando..." : "Enviar confirmación"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Éxito */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md bg-transparent border-0 shadow-none p-0 [&>button]:hidden [&_[data-slot='dialog-close']]:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-[24px] p-6 shadow-2xl"
            style={{
              background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
              border: `1px solid ${SOFT_BORDER}`,
            }}
          >
            <DialogHeader className="items-center">
              <div
                className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: successData?.asistencia ? "#E8F6EE" : "#FDECEC" }}
              >
                {successData?.asistencia ? (
                  <CheckCircle2 className="h-7 w-7" style={{ color: "#22C55E" }} />
                ) : (
                  <XCircle className="h-7 w-7" style={{ color: "#ef4444" }} />
                )}
              </div>
              <DialogTitle className="text-center">
                {successData?.asistencia ? "¡Confirmación enviada!" : "¡Respuesta registrada!"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm text-center text-slate-700">
              <p>
                Registramos la respuesta de <b>{successData?.nombreFamilia}</b> para{" "}
                <b>{personasLabel(successData?.nroPersonas)}</b>.
              </p>
              {successData?.asistencia ? (
                <p>{successYesMessage}</p>
              ) : (
                <p>{successNoMessage}</p>
              )}
            </div>

            <DialogFooter className="mt-4 justify-center">
              <DialogClose asChild>
                <Button
                  className="rounded-xl"
                  style={{
                    background: `linear-gradient(180deg, ${BABY_BLUE_TOP}, ${BABY_BLUE_BOTTOM})`,
                    border: `1px solid ${SOFT_BORDER}`,
                    color: SOFT_TEXT,
                  }}
                >
                  Aceptar
                </Button>
              </DialogClose>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
