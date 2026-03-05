// ============================================================
// FreeEntryForm.jsx — Entrada lliure amb mesures → volum
// ============================================================

import { useState } from "react";
import { calculateFreeLine, formatWeight, formatVolume, roundTo } from "../utils/calculator";

export function FreeEntryForm({ onAdd }) {
    const [label, setLabel] = useState("");
    const [dimL, setDimL] = useState("");
    const [dimW, setDimW] = useState("");
    const [dimH, setDimH] = useState("");
    const [weight, setWeight] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [qtyRaw, setQtyRaw] = useState("1");

    const l = parseFloat(dimL);
    const w = parseFloat(dimW);
    const h = parseFloat(dimH);
    const weightNum = parseFloat(weight);

    const hasDims = l > 0 && w > 0 && h > 0;
    const volume = hasDims ? roundTo((l / 100) * (w / 100) * (h / 100), 5) : null;
    const canAdd = label.trim() !== "" && hasDims && weightNum > 0 && quantity >= 1;

    function handleAdd() {
        const line = calculateFreeLine({
            label: label.trim(),
            dims: { l, w, h },
            weight: weightNum,
            quantity,
        });
        onAdd(line);
        setLabel("");
        setDimL(""); setDimW(""); setDimH("");
        setWeight("");
        setQuantity(1); setQtyRaw("1");
    }

    function handleQtyChange(e) {
        setQtyRaw(e.target.value);
        const n = parseInt(e.target.value, 10);
        if (!isNaN(n) && n >= 1) setQuantity(n);
    }

    function handleQtyBlur() {
        const n = parseInt(qtyRaw, 10);
        const valid = isNaN(n) || n < 1 ? 1 : n;
        setQtyRaw(String(valid));
        setQuantity(valid);
    }

    function qtyDelta(delta) {
        const next = Math.max(1, quantity + delta);
        setQuantity(next);
        setQtyRaw(String(next));
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Pas 1: Descripció */}
            <div className="flex flex-col gap-3">
                <StepLabel n={1} text="DESCRIPCIÓ" />
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="ex: Cablejat, Tires LED..."
                    className={`w-full bg-neutral-800 border font-mono text-sm px-3 py-2.5 rounded outline-none transition-all ${
                        label.trim() ? "border-yellow-400 text-neutral-200" : "border-neutral-700 text-neutral-400 focus:border-yellow-400"
                    }`}
                />
            </div>

            {/* Pas 2: Mesures (verticals) */}
            <div className="flex flex-col gap-3">
                <StepLabel n={2} text="MESURES (cm)" />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-600 w-10">Llarg</span>
                        <input type="text" inputMode="decimal" value={dimL} onChange={(e) => setDimL(e.target.value)} placeholder="—"
                            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400 text-center" />
                        <span className="text-xs font-mono text-neutral-600">cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-600 w-10">Ample</span>
                        <input type="text" inputMode="decimal" value={dimW} onChange={(e) => setDimW(e.target.value)} placeholder="—"
                            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400 text-center" />
                        <span className="text-xs font-mono text-neutral-600">cm</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-600 w-10">Alt</span>
                        <input type="text" inputMode="decimal" value={dimH} onChange={(e) => setDimH(e.target.value)} placeholder="—"
                            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400 text-center" />
                        <span className="text-xs font-mono text-neutral-600">cm</span>
                    </div>
                </div>
                {hasDims && (
                    <span className="text-xs font-mono text-neutral-500">→ {formatVolume(volume)} per unitat</span>
                )}
            </div>

            {/* Pas 3: Pes */}
            <div className="flex flex-col gap-3">
                <StepLabel n={3} text="PES (kg)" />
                <input
                    type="text"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="ex: 5.2"
                    className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2.5 rounded outline-none focus:border-yellow-400"
                />
            </div>

            {/* Pas 4: Quantitat — ±1 simple */}
            <div className="flex flex-col gap-3">
                <StepLabel n={4} text="QUANTITAT" />
                <div className="flex items-center gap-2">
                    <button onClick={() => qtyDelta(-1)}
                        className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-lg w-12 py-2 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all flex-shrink-0">
                        −
                    </button>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={qtyRaw}
                        onChange={handleQtyChange}
                        onBlur={handleQtyBlur}
                        className="flex-1 bg-neutral-800 border border-yellow-400 text-yellow-400 font-mono text-2xl font-bold text-center py-2 rounded outline-none"
                    />
                    <button onClick={() => qtyDelta(1)}
                        className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-lg w-12 py-2 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all flex-shrink-0">
                        +
                    </button>
                </div>
            </div>

            {/* Preview */}
            {canAdd && (
                <div className="bg-neutral-800 border border-neutral-700 rounded p-3 flex flex-col gap-1">
                    <span className="text-xs font-mono font-bold text-neutral-300">
                        {label.trim()} — {l}×{w}×{h} cm{quantity > 1 ? ` ×${quantity}` : ""}
                    </span>
                    <div className="flex gap-4">
                        <span className="text-sm font-mono font-bold text-yellow-400">⚖ {formatWeight(roundTo(weightNum * quantity, 3))}</span>
                        <span className="text-sm font-mono font-bold text-yellow-400">📦 {formatVolume(roundTo(volume * quantity, 5))}</span>
                    </div>
                </div>
            )}

            <button
                onClick={handleAdd}
                disabled={!canAdd}
                className="w-full bg-yellow-400 text-black font-mono font-bold text-sm py-3 rounded uppercase tracking-widest hover:bg-yellow-300 transition-all disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
            >
                + Afegir a la càrrega
            </button>
        </div>
    );
}

function StepLabel({ n, text }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neutral-700 text-yellow-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{text}</span>
        </div>
    );
}
