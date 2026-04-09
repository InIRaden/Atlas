"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortionMode, PortionSelection, RecallItem } from "@/types/recall";

interface PortionEstimationModalProps {
  open: boolean;
  item?: RecallItem;
  onClose: () => void;
  onSave: (portion: PortionSelection) => void;
}

const modes: Array<{ key: PortionMode; label: string; helper: string }> = [
  { key: "visual", label: "Dengan Foto Porsi", helper: "Pilih porsi yang paling mirip (S/M/L)." },
  {
    key: "household",
    label: "Dengan Alat Rumah Tangga",
    helper: "Gunakan gelas, mangkok, atau sendok.",
  },
  { key: "unit", label: "Dengan Satuan Produk", helper: "Gunakan slice, piece, atau pack." },
  { key: "grams", label: "Gram Langsung", helper: "Masukkan jumlah gram secara langsung." },
];

const visualSteps = ["S", "M", "L"] as const;
const fractionValues = [0, 0.25, 0.5, 0.75] as const;
const fractionLabels = ["0", "1/4", "1/2", "3/4"] as const;

export function PortionEstimationModal({
  open,
  item,
  onClose,
  onSave,
}: PortionEstimationModalProps) {
  const [phase, setPhase] = useState<"method" | "amount">("method");
  const [mode, setMode] = useState<PortionMode>("grams");
  const [grams, setGrams] = useState<number>(100);
  const [visualSize, setVisualSize] = useState<"S" | "M" | "L">("M");
  const [visualIndex, setVisualIndex] = useState(1);
  const [householdTool, setHouseholdTool] = useState<"Gelas" | "Mangkok" | "Sendok">("Gelas");
  const [householdWhole, setHouseholdWhole] = useState<number>(1);
  const [householdFractionIndex, setHouseholdFractionIndex] = useState(0);
  const [unitName, setUnitName] = useState<"Slice" | "Piece" | "Pack">("Piece");
  const [unitWhole, setUnitWhole] = useState<number>(1);
  const [unitFractionIndex, setUnitFractionIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    setPhase("method");
    setMode("visual");
    setVisualIndex(1);
    setVisualSize("M");
  }, [item?.id, open]);

  const preview = useMemo(() => {
    if (mode === "grams") return `${Math.max(1, grams)} gram`;
    if (mode === "visual") return `Visual ${visualSize}`;
    if (mode === "household") {
      const total = householdWhole + fractionValues[householdFractionIndex];
      return `${total} ${householdTool}`;
    }

    const total = unitWhole + fractionValues[unitFractionIndex];
    return `${total} ${unitName}`;
  }, [
    grams,
    householdFractionIndex,
    householdTool,
    householdWhole,
    mode,
    unitFractionIndex,
    unitName,
    unitWhole,
    visualSize,
  ]);

  const getVisualByIndex = (index: number): "S" | "M" | "L" => {
    if (index <= 0) return "S";
    if (index >= 2) return "L";
    return "M";
  };

  const saveSelection = () => {
    if (mode === "grams") {
      onSave({ mode, grams: Math.max(1, grams) });
      return;
    }

    if (mode === "visual") {
      onSave({ mode, visualSize });
      return;
    }

    if (mode === "household") {
      const total = Math.max(0.25, householdWhole + fractionValues[householdFractionIndex]);
      onSave({
        mode,
        household: { tool: householdTool, amount: Number(total.toFixed(2)) },
      });
      return;
    }

    const total = Math.max(0.25, unitWhole + fractionValues[unitFractionIndex]);
    onSave({
      mode,
      unit: { name: unitName, amount: Number(total.toFixed(2)) },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-300 bg-[#efefef] p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">Estimasi Porsi</h3>
            <p className="text-sm text-slate-600">Item: {item?.quickText ?? "Item terpilih"}</p>
          </div>
          <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white" onClick={onClose}>
            Tutup
          </button>
        </div>

        {phase === "method" ? (
          <section className="mt-5 space-y-4">
            <div className="rounded border border-slate-300 bg-[#dedede] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="max-w-2xl text-base text-slate-800 md:text-lg">
                  Bagaimana Anda ingin mengestimasi porsi <strong>{item?.quickText ?? "item ini"}</strong>?
                </p>
                <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white">
                  Bantuan
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {modes.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setMode(entry.key)}
                  className={`rounded border p-4 text-left transition ${
                    mode === entry.key
                      ? "border-atlas-gold bg-amber-50"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900 md:text-base">{entry.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.helper}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                onClick={() => setPhase("amount")}
              >
                Lanjut
              </button>
            </div>
          </section>
        ) : null}

        {phase === "amount" ? (
          <section className="mt-5 space-y-4">
            <button
              type="button"
              className="text-sm text-blue-700 underline"
              onClick={() => setPhase("method")}
            >
              Kembali pilih metode
            </button>

            <div className="rounded border border-slate-300 bg-[#dedede] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="max-w-2xl text-base text-slate-800 md:text-lg">
                  {mode === "visual"
                    ? "Pilih ukuran visual yang paling mendekati porsi Anda."
                    : mode === "household"
                      ? `Berapa banyak ${householdTool.toLowerCase()} ${item?.quickText ?? "item"} yang Anda konsumsi?`
                      : mode === "unit"
                        ? `Berapa banyak ${unitName.toLowerCase()} ${item?.quickText ?? "item"} yang Anda konsumsi?`
                        : "Masukkan estimasi gram untuk item ini."}
                </p>
                <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white">
                  Bantuan
                </button>
              </div>
            </div>

            {mode === "visual" ? (
              <div className="space-y-4">
                <div className="rounded border border-slate-300 bg-white p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {visualSteps.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setVisualSize(size);
                          setVisualIndex(size === "S" ? 0 : size === "M" ? 1 : 2);
                        }}
                        className={`rounded border p-4 text-center ${
                          visualSize === size ? "border-atlas-cyan bg-cyan-50" : "border-slate-300"
                        }`}
                      >
                        <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-slate-200" />
                        <p className="font-semibold">{size}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-4 py-2 text-lg font-semibold text-white"
                    onClick={() => {
                      const next = Math.max(0, visualIndex - 1);
                      setVisualIndex(next);
                      setVisualSize(getVisualByIndex(next));
                    }}
                  >
                    -
                  </button>
                  <p className="text-sm text-slate-600">Ukuran saat ini: {visualSize}</p>
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-4 py-2 text-lg font-semibold text-white"
                    onClick={() => {
                      const next = Math.min(2, visualIndex + 1);
                      setVisualIndex(next);
                      setVisualSize(getVisualByIndex(next));
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            {mode === "household" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(["Gelas", "Mangkok", "Sendok"] as const).map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className={`rounded border px-3 py-2 text-sm font-semibold ${
                        householdTool === tool
                          ? "border-atlas-gold bg-amber-50"
                          : "border-slate-300 bg-white"
                      }`}
                      onClick={() => setHouseholdTool(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() => setHouseholdWhole((value) => value + 1)}
                    >
                      ▲
                    </button>
                    <p className="text-2xl">{householdWhole}</p>
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() => setHouseholdWhole((value) => Math.max(0, value - 1))}
                    >
                      ▼
                    </button>
                    <p className="text-xs text-slate-500">Utuh</p>
                  </div>

                  <p className="text-xl font-semibold">dan</p>

                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() =>
                        setHouseholdFractionIndex((value) => (value + 1) % fractionValues.length)
                      }
                    >
                      ▲
                    </button>
                    <p className="text-2xl">{fractionLabels[householdFractionIndex]}</p>
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() =>
                        setHouseholdFractionIndex(
                          (value) => (value - 1 + fractionValues.length) % fractionValues.length,
                        )
                      }
                    >
                      ▼
                    </button>
                    <p className="text-xs text-slate-500">Pecahan</p>
                  </div>
                </div>
              </div>
            ) : null}

            {mode === "unit" ? (
              <div className="space-y-4">
                <select
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={unitName}
                  onChange={(event) => setUnitName(event.target.value as "Slice" | "Piece" | "Pack")}
                >
                  <option>Slice</option>
                  <option>Piece</option>
                  <option>Pack</option>
                </select>

                <div className="flex items-center gap-4">
                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() => setUnitWhole((value) => value + 1)}
                    >
                      ▲
                    </button>
                    <p className="text-2xl">{unitWhole}</p>
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() => setUnitWhole((value) => Math.max(0, value - 1))}
                    >
                      ▼
                    </button>
                    <p className="text-xs text-slate-500">Utuh</p>
                  </div>

                  <p className="text-xl font-semibold">dan</p>

                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() => setUnitFractionIndex((value) => (value + 1) % fractionValues.length)}
                    >
                      ▲
                    </button>
                    <p className="text-2xl">{fractionLabels[unitFractionIndex]}</p>
                    <button
                      type="button"
                      className="h-10 w-12 rounded bg-[#b4b4b4] text-white"
                      onClick={() =>
                        setUnitFractionIndex(
                          (value) => (value - 1 + fractionValues.length) % fractionValues.length,
                        )
                      }
                    >
                      ▼
                    </button>
                    <p className="text-xs text-slate-500">Pecahan</p>
                  </div>
                </div>
              </div>
            ) : null}

            {mode === "grams" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-4 py-2 text-lg font-semibold text-white"
                    onClick={() => setGrams((value) => Math.max(1, value - 5))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={grams}
                    onChange={(event) => setGrams(Number(event.target.value || 0))}
                    className="w-40 rounded border border-slate-300 bg-white px-3 py-2 text-center text-lg"
                  />
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-4 py-2 text-lg font-semibold text-white"
                    onClick={() => setGrams((value) => value + 5)}
                  >
                    +
                  </button>
                  <p className="text-sm text-slate-600">gram</p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-slate-300 pt-4">
              <p className="text-sm text-slate-600">Preview: {preview}</p>
              <button
                type="button"
                className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                onClick={saveSelection}
              >
                Saya sudah sebanyak itu
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
