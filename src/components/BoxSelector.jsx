// ============================================================
// BoxSelector.jsx — Selector de caixes predefinides
// ============================================================

import { useState } from "react";
import { BOX_SIZES } from "../data/products";
import { calculateBoxLine, formatWeight, formatVolume, roundTo } from "../utils/calculator";

export function BoxSelector({ onAdd, onToast }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [weight, setWeight] = useState("");
    const [observations, setObservations] = useState("");

    const boxSize = selectedSize ? BOX_SIZES[selectedSize] : null;
    const weightNum = parseFloat(weight);
    const volume = boxSize
        ? roundTo((boxSize.dims.l / 100) * (boxSize.dims.w / 100) * (boxSize.dims.h / 100), 5)
        : null;

    const canAdd = selectedSize && weight !== "" && weightNum > 0;

    function handleAdd() {
        const line = calculateBoxLine({
            boxSizeKey: selectedSize,
            boxSize,
            weight: weightNum,
            observations,
        });
        onAdd(line);
        // reset
        setWeight("");
        setObservations("");
    }

    return (
        <div className="flex flex-col gap-5">

            {/* Pas 1: Mida */}
            <div className="flex flex-col gap-3">
                <StepLabel n={1} text="MIDA DE LA CAIXA" />
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(BOX_SIZES).map(([key, size]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedSize(key)}
                            className={`p-3 rounded border text-left transition-all ${
                                selectedSize === key
                                    ? "bg-yellow-400/10 border-yellow-400"
                                    : "bg-neutral-800 border-neutral-700 hover:border-yellow-400"
                            }`}
                        >
                            <span className={`block text-sm font-mono font-bold ${selectedSize === key ? "text-yellow-400" : "text-neutral-300"}`}>
                                {size.label}
                            </span>
                            <span className="block text-xs font-mono text-neutral-500 mt-1">
                                {size.dims.l}×{size.dims.w}×{size.dims.h}cm
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pas 2: Pes */}
            {selectedSize && (
                <div className="flex flex-col gap-3">
                    <StepLabel n={2} text="PES TOTAL (kg)" />
                    <input
                        type="text"
                        inputMode="decimal"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="ex: 12.5"
                        className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2.5 rounded outline-none focus:border-yellow-400"
                    />
                </div>
            )}

            {/* Pas 3: Observacions */}
            {selectedSize && (
                <div className="flex flex-col gap-3">
                    <StepLabel n={3} text="OBSERVACIONS" optional />
                    <input
                        type="text"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="ex: 24 controladors, 12 fonts..."
                        className="w-full bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-sm px-3 py-2.5 rounded outline-none focus:border-yellow-400"
                    />
                </div>
            )}

            {/* Preview */}
            {selectedSize && (
                <div className="bg-neutral-800 border border-neutral-700 rounded p-3 flex flex-col gap-1">
                    <span className="text-xs font-mono font-bold text-neutral-300">
                        Caixa {boxSize.label} — {boxSize.dims.l}×{boxSize.dims.w}×{boxSize.dims.h} cm
                    </span>
                    <div className="flex gap-4">
                        <span className={`text-sm font-mono font-bold ${weightNum > 0 ? "text-yellow-400" : "text-neutral-600"}`}>
                            ⚖ {weightNum > 0 ? formatWeight(weightNum) : "— kg"}
                        </span>
                        <span className="text-sm font-mono font-bold text-yellow-400">
                            📦 {formatVolume(volume)}
                        </span>
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

function StepLabel({ n, text, optional }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neutral-700 text-yellow-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                {n}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                {text}
                {optional && <span className="text-neutral-700 ml-1">(opcional)</span>}
            </span>
        </div>
    );
}
