// ============================================================
// QuantityControl.jsx — Botons de quantitat ràpida
// ============================================================

export function QuantityControl({ quantity, onChange }) {
    const deltas = [-10, -5, -1, 1, 5, 10];

    function handleDelta(delta) {
        const next = Math.max(1, quantity + delta);
        onChange(next);
    }

    function handleInput(e) {
        const val = parseInt(e.target.value) || 1;
        onChange(Math.max(1, val));
    }

    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Quantitat
            </span>

            <div className="flex items-center gap-1">
                {deltas.map((delta) => (
                    <button
                        key={delta}
                        onClick={() => handleDelta(delta)}
                        className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-2 py-2 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all min-w-[36px]"
                    >
                        {delta > 0 ? `+${delta}` : delta}
                    </button>
                ))}
            </div>

            <input
                type="number"
                value={quantity}
                onChange={handleInput}
                min={1}
                className="w-full bg-neutral-800 border border-yellow-400 text-yellow-400 font-mono text-2xl font-bold text-center py-2 rounded outline-none"
            />
        </div>
    );
}