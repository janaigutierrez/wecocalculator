// ============================================================
// DeliveryModal.jsx — Mock modal albarà (pendent de definir)
// ============================================================

import { printDeliveryNote } from "../utils/print";

export function DeliveryModal({ cart, onClose }) {
    function handlePrint() {
        printDeliveryNote(cart);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg w-full max-w-md">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-neutral-800">
                    <span className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
                        Generar Document
                    </span>
                    <button
                        onClick={onClose}
                        className="text-neutral-600 hover:text-neutral-300 transition-colors text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Body — Mock */}
                <div className="p-5 flex flex-col items-center gap-4 py-10">
                    <span className="text-4xl">🚧</span>
                    <p className="text-sm font-mono text-neutral-400 text-center">
                        Funcionalitat pendent de definir amb l'encarregat
                    </p>
                    <p className="text-xs font-mono text-neutral-600 text-center">
                        {cart.length} {cart.length === 1 ? "línia" : "línies"} preparades
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-5 border-t border-neutral-800">
                    <button
                        onClick={onClose}
                        className="bg-transparent border border-neutral-700 text-neutral-400 font-mono text-xs px-4 py-2 rounded hover:border-neutral-500 hover:text-neutral-200 transition-all"
                    >
                        Tancar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-yellow-400 text-black font-mono font-bold text-xs px-4 py-2 rounded hover:bg-yellow-300 transition-all"
                    >
                        🖨 Imprimir (mock)
                    </button>
                </div>
            </div>
        </div>
    );
}