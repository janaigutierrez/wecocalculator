// ============================================================
// App.jsx — Component principal
// ============================================================

import { useState } from "react";
import { useCart } from "./hooks/useCart";
import { useSessions } from "./hooks/useSessions";
import { products, PALLET_BASES } from "./data/products";
import { loadLastSelection, saveLastSelection } from "./utils/storage";
import { calculateLine, calculatePalletLine, formatWeight, formatVolume } from "./utils/calculator";
import { ProductSelector } from "./components/ProductSelector";
import { FormatSelector } from "./components/FormatSelector";
import { QuantityControl } from "./components/QuantityControl";
import { BoxSelector } from "./components/BoxSelector";
import { FreeEntryForm } from "./components/FreeEntryForm";
import { CartLine } from "./components/CartLine";
import { CartTotals } from "./components/CartTotals";
import { SessionTabs } from "./components/SessionTabs";
import { DeliveryModal } from "./components/DeliveryModal";

const ENTRY_TYPES = [
    { key: "barrera", label: "Barrera" },
    { key: "caixa",   label: "Caixa" },
    { key: "lliure",  label: "Lliure" },
];

export default function App() {
    const {
        sessions, activeId, activeSession,
        createSession, switchSession, updateActiveCart, renameSession, deleteSession,
    } = useSessions();

    const { cart, totals, addLine, removeLine, updateLineQty, clearCart } = useCart(
        activeSession?.cart ?? [],
        updateActiveCart
    );

    const lastSelection = loadLastSelection();
    const [entryType, setEntryType] = useState("barrera");

    // --- Barrera state (valida selecció guardada: el format podria ser stale) ---
    const validProductKey = lastSelection.productKey && products[lastSelection.productKey]
        ? lastSelection.productKey : null;
    const validFormatKey = validProductKey && lastSelection.formatKey &&
        products[validProductKey]?.formats[lastSelection.formatKey]
        ? lastSelection.formatKey : null;

    const [selectedProduct, setSelectedProduct] = useState(validProductKey);
    const [selectedFormat, setSelectedFormat] = useState(validFormatKey);
    const [selectedPalletBase, setSelectedPalletBase] = useState(null);
    const [palletHeightCm, setPalletHeightCm] = useState("");
    const [quantity, setQuantity] = useState(1);       // nombre de packs (mode pack)
    const [palletUnitCount, setPalletUnitCount] = useState(1); // unitats al palet (mode palet)

    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    // --- Toast ---
    function showToast(message, type = "success") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    // --- Selecció producte ---
    function handleSelectProduct(key) {
        setSelectedProduct(key);
        setSelectedFormat(null);
        setSelectedPalletBase(null);
        setPalletHeightCm("");
        setQuantity(1);
        setPalletUnitCount(1);
    }

    // --- Toggle format pack (re-clic desselecciona) ---
    function handleSelectFormat(key) {
        setSelectedFormat(selectedFormat === key ? null : key);
    }

    // --- Toggle palet base (desselecciona si ja estava) ---
    function handleSelectPalletBase(key) {
        if (selectedPalletBase === key) {
            setSelectedPalletBase(null);
            setPalletHeightCm("");
        } else {
            setSelectedPalletBase(key);
            setPalletHeightCm("");
            // No resetegem quantity: l'usuari pot haver entrat ja les unitats
        }
    }

    // --- Afegir línia barrera ---
    function handleAddBarrera() {
        const product = products[selectedProduct];

        if (selectedPalletBase) {
            // Mode palet: unitats + base de palet + alçada
            const palletBase = PALLET_BASES[selectedPalletBase];
            const height = parseFloat(palletHeightCm);
            if (!height || height <= 0) {
                showToast("Introdueix l'alçada del palet", "error");
                return;
            }
            const line = calculatePalletLine({
                product,
                productKey: selectedProduct,
                palletBase,
                palletBaseKey: selectedPalletBase,
                unitCount: palletUnitCount,
                palletHeightCm: height,
            });
            addLine(line);
            setPalletUnitCount(1);
        } else {
            // Mode pack
            const format = product.formats[selectedFormat];
            if (!format) { showToast("Format no vàlid", "error"); return; }
            const line = calculateLine({
                product,
                productKey: selectedProduct,
                format,
                formatKey: selectedFormat,
                quantity,
            });
            if (!line) { showToast("Error de càlcul", "error"); return; }
            addLine(line);
            setQuantity(1);
        }

        saveLastSelection(selectedProduct, selectedFormat);
        showToast("Línia afegida ✓");
    }

    // --- Afegir línia caixa / lliure ---
    function handleAddLine(line) {
        addLine(line);
        showToast("Línia afegida ✓");
    }

    // --- Netejar cart ---
    function handleClearCart() {
        if (cart.length === 0) return;
        if (window.confirm("Netejar tota la càrrega?")) clearCart();
    }

    // --- Lògica de validació ---
    const palletMode = !!selectedPalletBase;
    const packMode = !palletMode && !!selectedFormat;
    const hasSelection = palletMode || packMode;

    const canAddBarrera = selectedProduct && (
        (palletMode && palletUnitCount >= 1 && palletHeightCm && parseFloat(palletHeightCm) > 0) ||
        (packMode && quantity >= 1)
    );

    const quantityLabel = palletMode ? "UNITATS AL PALET" : "PACKS";

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">

            {/* ===== HEADER ===== */}
            <header className="sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800 px-5 h-13 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-lg">⬡</span>
                    <span className="font-mono font-bold text-xs tracking-[4px] uppercase">WECO Calculator</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowModal(true)}
                        className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-3 py-1.5 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all">
                        🖨 Document
                    </button>
                    <button onClick={handleClearCart}
                        className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-3 py-1.5 rounded hover:border-red-500 hover:text-red-400 transition-all">
                        ✕ Netejar
                    </button>
                </div>
            </header>

            {/* ===== LAYOUT ===== */}
            <main className="flex flex-1 overflow-hidden">

                {/* ===== PANEL ESQUERRE ===== */}
                <section className="w-[400px] flex-shrink-0 border-r border-neutral-800 bg-neutral-900 overflow-y-auto p-5 flex flex-col gap-5">

                    {/* Selector de tipus */}
                    <div className="grid grid-cols-3 gap-1 bg-neutral-800 border border-neutral-700 rounded p-1">
                        {ENTRY_TYPES.map(({ key, label }) => (
                            <button key={key} onClick={() => setEntryType(key)}
                                className={`py-2 text-xs font-mono font-bold rounded uppercase tracking-widest transition-all ${
                                    entryType === key ? "bg-yellow-400 text-black" : "text-neutral-500 hover:text-neutral-300"
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ===== MODE BARRERA ===== */}
                    {entryType === "barrera" && (
                        <>
                            {/* Pas 1: Producte */}
                            <Step n={1} label="PRODUCTE">
                                <ProductSelector selectedProduct={selectedProduct} onSelect={handleSelectProduct} />
                            </Step>

                            {/* Pas 2: Format + Palet base + Unitats + Alçada (tot junt) */}
                            {selectedProduct && (
                                <Step n={2} label="FORMAT / PALET">
                                    <FormatSelector
                                        selectedProduct={selectedProduct}
                                        selectedFormat={selectedFormat}
                                        onSelectFormat={handleSelectFormat}
                                        selectedPalletBase={selectedPalletBase}
                                        onSelectPalletBase={handleSelectPalletBase}
                                        palletHeightCm={palletHeightCm}
                                        onPalletHeightChange={setPalletHeightCm}
                                        palletUnitCount={palletUnitCount}
                                        onPalletUnitCountChange={setPalletUnitCount}
                                    />
                                </Step>
                            )}

                            {/* Pas 3: Quantitat — només en mode pack */}
                            {selectedProduct && packMode && (
                                <Step n={3} label={quantityLabel}>
                                    <QuantityControl quantity={quantity} onChange={setQuantity} label={quantityLabel} />
                                </Step>
                            )}

                            {/* Preview */}
                            {selectedProduct && hasSelection && (
                                <BarreraPreview
                                    selectedProduct={selectedProduct}
                                    selectedFormat={selectedFormat}
                                    selectedPalletBase={selectedPalletBase}
                                    quantity={palletMode ? palletUnitCount : quantity}
                                    palletHeightCm={palletHeightCm ? parseFloat(palletHeightCm) : null}
                                    palletMode={palletMode}
                                />
                            )}

                            {/* Botó afegir */}
                            {selectedProduct && hasSelection && (
                                <button onClick={handleAddBarrera} disabled={!canAddBarrera}
                                    className="w-full bg-yellow-400 text-black font-mono font-bold text-sm py-3 rounded uppercase tracking-widest hover:bg-yellow-300 transition-all disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed">
                                    + Afegir a la càrrega
                                </button>
                            )}
                        </>
                    )}

                    {/* ===== MODE CAIXA ===== */}
                    {entryType === "caixa" && <BoxSelector onAdd={handleAddLine} />}

                    {/* ===== MODE LLIURE ===== */}
                    {entryType === "lliure" && <FreeEntryForm onAdd={handleAddLine} />}

                </section>

                {/* ===== PANEL DRET: Full de càrrega ===== */}
                <section className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">

                    {/* Pestanyes de sessió */}
                    <SessionTabs
                        sessions={sessions}
                        activeId={activeId}
                        onSwitch={switchSession}
                        onCreate={createSession}
                        onRename={renameSession}
                        onDelete={deleteSession}
                    />

                    {/* Línies del cart */}
                    {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-lg py-16 gap-2">
                            <span className="text-neutral-600 font-mono text-sm">Cap línia afegida</span>
                            <span className="text-neutral-700 font-mono text-xs">Selecciona el tipus d'entrada al panell esquerre</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {cart.map((line) => (
                                <CartLine
                                    key={line.id}
                                    line={line}
                                    onRemove={removeLine}
                                    onUpdateQty={(delta) => updateLineQty(line.id, delta)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Separador visual ─── TOTALS ─── */}
                    {cart.length > 0 && (
                        <div className="flex items-center gap-3 pt-1">
                            <div className="flex-1 border-t-2 border-neutral-800" />
                            <span className="text-[10px] font-mono uppercase tracking-[3px] text-neutral-700">Totals</span>
                            <div className="flex-1 border-t-2 border-neutral-800" />
                        </div>
                    )}

                    {cart.length > 0 && <CartTotals totals={totals} cart={cart} />}
                </section>
            </main>

            {showModal && <DeliveryModal cart={cart} onClose={() => setShowModal(false)} />}

            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs px-5 py-2.5 rounded-full border transition-all ${
                    toast.type === "error" ? "bg-neutral-900 border-red-500 text-red-400" : "bg-neutral-900 border-green-500 text-green-400"
                }`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

// ---- Step wrapper ----
function Step({ n, label, children }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-700 text-yellow-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{label}</span>
            </div>
            {children}
        </div>
    );
}

// ---- Preview per barreres ----
function BarreraPreview({ selectedProduct, selectedFormat, selectedPalletBase, quantity, palletHeightCm, palletMode }) {
    const product = products[selectedProduct];

    if (palletMode) {
        const palletBase = PALLET_BASES[selectedPalletBase];
        if (!palletHeightCm || palletHeightCm <= 0) {
            return (
                <div className="bg-neutral-800 border border-neutral-700 rounded p-3">
                    <span className="text-xs font-mono text-neutral-600">Introdueix l'alçada del palet per calcular</span>
                </div>
            );
        }
        const weight = quantity * product.unitWeight + palletBase.weight;
        const volume = (product.barLengthCm / 100) * (palletBase.dims.width / 100) * (palletHeightCm / 100);
        return (
            <div className="bg-neutral-800 border border-neutral-700 rounded p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-mono font-bold text-neutral-200">{product.shortName} · {palletBase.label}</span>
                    <span className="text-xs font-mono text-neutral-500">{quantity} unitats</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-sm font-mono font-bold text-yellow-400">⚖ {formatWeight(weight)}</span>
                    <span className="text-sm font-mono font-bold text-yellow-400">📦 {formatVolume(volume)}</span>
                </div>
            </div>
        );
    }

    if (!selectedFormat) return null;
    const format = product.formats[selectedFormat];
    if (!format) return null; // clau de format obsoleta (ex: halfPallet eliminat)
    const totalUnits = format.units * quantity;
    const totalWeight = format.weight * quantity;
    const totalVolume = format.volume * quantity;
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-mono font-bold text-neutral-200">{product.shortName} · {format.label}</span>
                <span className="text-xs font-mono text-neutral-500">×{quantity} = {totalUnits}u</span>
            </div>
            <div className="flex gap-4">
                <span className="text-sm font-mono font-bold text-yellow-400">⚖ {formatWeight(totalWeight)}</span>
                <span className="text-sm font-mono font-bold text-yellow-400">📦 {formatVolume(totalVolume)}</span>
            </div>
        </div>
    );
}
