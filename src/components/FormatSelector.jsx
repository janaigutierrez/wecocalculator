// ============================================================
// FormatSelector.jsx — Packs + Base de palet + Unitats + Alçada
// ============================================================

import { useState, useEffect } from "react";
import { products, PALLET_BASES } from "../data/products";

export function FormatSelector({
    selectedProduct,
    selectedFormat,
    onSelectFormat,
    selectedPalletBase,
    onSelectPalletBase,
    palletHeightCm,
    onPalletHeightChange,
    palletUnitCount,
    onPalletUnitCountChange,
}) {
    if (!selectedProduct) return null;

    const formats = products[selectedProduct].formats;

    // Local raw string for unit count input (allows free typing / clearing)
    const [rawUnits, setRawUnits] = useState(String(palletUnitCount ?? 1));

    useEffect(() => {
        setRawUnits(String(palletUnitCount ?? 1));
    }, [palletUnitCount]);

    function handleUnitsChange(e) {
        setRawUnits(e.target.value);
        const n = parseInt(e.target.value, 10);
        if (!isNaN(n) && n >= 1) onPalletUnitCountChange(n);
    }

    function handleUnitsBlur() {
        const n = parseInt(rawUnits, 10);
        const valid = isNaN(n) || n < 1 ? 1 : n;
        setRawUnits(String(valid));
        onPalletUnitCountChange(valid);
    }

    function handlePalletClick(key) {
        onSelectPalletBase(selectedPalletBase === key ? null : key);
    }

    return (
        <div className="flex flex-col gap-3">

            {/* Pack formats — grid 2×2 */}
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(formats).map(([key, format]) => (
                    <button
                        key={key}
                        onClick={() => onSelectFormat(key)}
                        className={`p-3 rounded border text-left transition-all ${
                            selectedFormat === key
                                ? "bg-yellow-400/10 border-yellow-400"
                                : "bg-neutral-800 border-neutral-700 hover:border-yellow-400"
                        }`}
                    >
                        <span className={`block text-sm font-mono font-bold ${selectedFormat === key ? "text-yellow-400" : "text-neutral-300"}`}>
                            {format.label}
                        </span>
                        <span className="block text-xs font-mono text-neutral-500 mt-1">
                            {format.weight}kg · {format.volume.toFixed(4)}m³
                        </span>
                    </button>
                ))}
            </div>

            {/* Separador "sobre palet" */}
            <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-neutral-800" />
                <span className="text-xs font-mono text-neutral-700 uppercase tracking-widest whitespace-nowrap">sobre palet</span>
                <div className="flex-1 border-t border-neutral-800" />
            </div>

            {/* Unitats al palet */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 flex-shrink-0 w-16">Unitats</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={rawUnits}
                    onChange={handleUnitsChange}
                    onBlur={handleUnitsBlur}
                    placeholder="—"
                    className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400 text-center"
                />
            </div>

            {/* Pallet base buttons — 3 col */}
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(PALLET_BASES).map(([key, palet]) => (
                    <button
                        key={key}
                        onClick={() => handlePalletClick(key)}
                        className={`p-2 rounded border text-center transition-all ${
                            selectedPalletBase === key
                                ? "bg-yellow-400/10 border-yellow-400"
                                : "bg-neutral-800 border-neutral-700 hover:border-yellow-400"
                        }`}
                    >
                        <span className={`block text-xs font-mono font-bold ${selectedPalletBase === key ? "text-yellow-400" : "text-neutral-400"}`}>
                            {palet.shortLabel}
                        </span>
                        <span className="block text-xs font-mono text-neutral-600 mt-0.5">
                            ~{palet.weight}kg
                        </span>
                    </button>
                ))}
            </div>

            {/* Alçada — apareix quan hi ha palet seleccionat */}
            {selectedPalletBase && (
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 flex-shrink-0 w-16">Alçada</span>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={palletHeightCm}
                        onChange={(e) => onPalletHeightChange(e.target.value)}
                        placeholder="cm"
                        className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400 text-center"
                    />
                    <span className="text-xs font-mono text-neutral-600">cm</span>
                </div>
            )}
        </div>
    );
}
