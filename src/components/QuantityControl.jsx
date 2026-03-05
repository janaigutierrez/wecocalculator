// ============================================================
// QuantityControl.jsx — Camp de quantitat amb ±1
// ============================================================

import { useState, useEffect } from "react";

export function QuantityControl({ quantity, onChange, label = "QUANTITAT" }) {
    // Raw string state per permetre editar lliurement el camp de text
    const [raw, setRaw] = useState(String(quantity));

    useEffect(() => {
        setRaw(String(quantity));
    }, [quantity]);

    function handleDelta(delta) {
        const next = Math.max(1, quantity + delta);
        setRaw(String(next));
        onChange(next);
    }

    function handleChange(e) {
        setRaw(e.target.value);
        const num = parseInt(e.target.value, 10);
        if (!isNaN(num) && num >= 1) onChange(num);
    }

    function handleBlur() {
        const num = parseInt(raw, 10);
        const valid = isNaN(num) || num < 1 ? 1 : num;
        setRaw(String(valid));
        onChange(valid);
    }

    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{label}</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleDelta(-1)}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-lg w-12 py-2 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all flex-shrink-0"
                >
                    −
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={raw}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="flex-1 bg-neutral-800 border border-yellow-400 text-yellow-400 font-mono text-2xl font-bold text-center py-2 rounded outline-none"
                />
                <button
                    onClick={() => handleDelta(1)}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-lg w-12 py-2 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all flex-shrink-0"
                >
                    +
                </button>
            </div>
        </div>
    );
}
