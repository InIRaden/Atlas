"use client";

import { useMemo, useState } from "react";
import type { PortionMode, PortionSelection, RecallItem } from "@/types/recall";

interface PortionEstimationModalProps {
  open: boolean;
  item?: RecallItem;
  onClose: () => void;
  onSave: (portion: PortionSelection) => void;
}

const modes: Array<{ key: PortionMode; label: string; helper: string }> = [
  { key: "grams", label: "Mode A: Direct Grams", helper: "Input exact gram amount." },
  { key: "visual", label: "Mode B: Visual/Photo", helper: "Pick visual S/M/L reference." },
  {
    key: "household",
    label: "Mode C: Household",
    helper: "Use Gelas, Mangkok, or Sendok.",
  },
  { key: "unit", label: "Mode D: Standard Units", helper: "Use Slice, Piece, or Pack." },
];

export function PortionEstimationModal({
  open,
  item,
  onClose,
  onSave,
}: PortionEstimationModalProps) {
  const [mode, setMode] = useState<PortionMode>("grams");
  const [grams, setGrams] = useState<number>(100);
  const [visualSize, setVisualSize] = useState<"S" | "M" | "L">("M");
  const [householdTool, setHouseholdTool] = useState<"Gelas" | "Mangkok" | "Sendok">("Gelas");
  const [householdAmount, setHouseholdAmount] = useState<number>(1);
  const [unitName, setUnitName] = useState<"Slice" | "Piece" | "Pack">("Piece");
  const [unitAmount, setUnitAmount] = useState<number>(1);

  const preview = useMemo(() => {
    if (mode === "grams") return `${grams} g`;
    if (mode === "visual") return `Visual ${visualSize}`;
    if (mode === "household") return `${householdAmount} ${householdTool}`;
    return `${unitAmount} ${unitName}`;
  }, [grams, householdAmount, householdTool, mode, unitAmount, unitName, visualSize]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Portion Estimation</h3>
            <p className="text-sm text-slate-500">{item?.quickText ?? "Selected item"}</p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {modes.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => setMode(entry.key)}
              className={`rounded-2xl border p-3 text-left transition ${
                mode === entry.key
                  ? "border-atlas-gold bg-amber-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <p className="font-semibold">{entry.label}</p>
              <p className="text-xs text-slate-500">{entry.helper}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          {mode === "grams" ? (
            <label className="block">
              <span className="text-sm font-medium">Grams</span>
              <input
                type="number"
                min={1}
                value={grams}
                onChange={(event) => setGrams(Number(event.target.value || 0))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
          ) : null}

          {mode === "visual" ? (
            <div>
              <p className="text-sm font-medium">Photo Portion</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {(["S", "M", "L"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setVisualSize(size)}
                    className={`rounded-2xl border p-4 text-center ${
                      visualSize === size
                        ? "border-atlas-cyan bg-cyan-50"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-lg font-semibold">{size}</span>
                    <p className="text-xs text-slate-500">Visual ref</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "household" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Tool</span>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={householdTool}
                  onChange={(event) =>
                    setHouseholdTool(event.target.value as "Gelas" | "Mangkok" | "Sendok")
                  }
                >
                  <option>Gelas</option>
                  <option>Mangkok</option>
                  <option>Sendok</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Amount</span>
                <input
                  type="number"
                  min={0.25}
                  step={0.25}
                  value={householdAmount}
                  onChange={(event) => setHouseholdAmount(Number(event.target.value || 0))}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          ) : null}

          {mode === "unit" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Unit</span>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                  value={unitName}
                  onChange={(event) =>
                    setUnitName(event.target.value as "Slice" | "Piece" | "Pack")
                  }
                >
                  <option>Slice</option>
                  <option>Piece</option>
                  <option>Pack</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Amount</span>
                <input
                  type="number"
                  min={1}
                  value={unitAmount}
                  onChange={(event) => setUnitAmount(Number(event.target.value || 0))}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">Preview: {preview}</p>
          <button
            type="button"
            className="rounded-xl bg-atlas-gold px-4 py-2 font-semibold text-slate-900"
            onClick={() => {
              if (mode === "grams") {
                onSave({ mode, grams });
                return;
              }
              if (mode === "visual") {
                onSave({ mode, visualSize });
                return;
              }
              if (mode === "household") {
                onSave({
                  mode,
                  household: { tool: householdTool, amount: householdAmount },
                });
                return;
              }
              onSave({
                mode,
                unit: { name: unitName, amount: unitAmount },
              });
            }}
          >
            Save Portion
          </button>
        </div>
      </div>
    </div>
  );
}
