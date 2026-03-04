// ============================================================
// App.jsx — Component principal
// ============================================================

import { useState } from "react";
import { useCart } from "./hooks/useCart";
import { products } from "./data/products";
import { loadLastSelection } from "./utils/storage";
import { ProductSelector } from "./components/ProductSelector";
import { FormatSelector } from "./components/FormatSelector";
import { QuantityControl } from "./components/QuantityControl";
import { LinePreview } from "./components/LinePreview";
import { CartLine } from "./components/CartLine";
import { CartTotals } from "./components/CartTotals";
import { DeliveryModal } from "./components/DeliveryModal";

export default function App() {
  const { cart, totals, addLine, removeLine, clearCart } = useCart();

  const lastSelection = loadLastSelection();
  const [selectedProduct, setSelectedProduct] = useState(lastSelection.productKey || null);
  const [selectedFormat, setSelectedFormat] = useState(lastSelection.formatKey || null);
  const [quantity, setQuantity] = useState(1);
  const [palletHeightCm, setPalletHeightCm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [mode, setMode] = useState("predefined");

  // --- Selecció producte ---
  function handleSelectProduct(key) {
    setSelectedProduct(key);
    setSelectedFormat(null);
    setPalletHeightCm("");
  }

  // --- Selecció format ---
  function handleSelectFormat(key) {
    setSelectedFormat(key);
    setPalletHeightCm("");
  }

  // --- Toast ---
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  // --- Afegir línia ---
  function handleAddLine() {
    const result = addLine({
      productKey: selectedProduct,
      formatKey: selectedFormat,
      quantity,
      palletHeightCm: palletHeightCm ? parseFloat(palletHeightCm) : null,
    });

    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast("Línia afegida ✓");
      setQuantity(1);
    }
  }

  // --- Netejar cart ---
  function handleClearCart() {
    if (cart.length === 0) return;
    if (window.confirm("Netejar tota la càrrega?")) clearCart();
  }

  const selectedFormatData = selectedProduct && selectedFormat
    ? products[selectedProduct]?.formats[selectedFormat]
    : null;

  const isPallet = selectedFormatData?.type === "pallet";
  const canAdd = selectedProduct && selectedFormat && (!isPallet || palletHeightCm > 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800 px-5 h-13 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-lg">⬡</span>
          <span className="font-mono font-bold text-xs tracking-[4px] uppercase">
            WECO Calculator
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-3 py-1.5 rounded hover:border-yellow-400 hover:text-neutral-200 transition-all"
          >
            🖨 Document
          </button>
          <button
            onClick={handleClearCart}
            className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono text-xs px-3 py-1.5 rounded hover:border-red-500 hover:text-red-400 transition-all"
          >
            ✕ Netejar
          </button>
        </div>
      </header>

      {/* ===== LAYOUT ===== */}
      <main className="flex flex-1 overflow-hidden">

        {/* ===== PANEL ESQUERRE: Configurador ===== */}
        <section className="w-[400px] flex-shrink-0 border-r border-neutral-800 bg-neutral-900 overflow-y-auto p-5 flex flex-col gap-5">

          {/* Mode switch */}
          <div className="grid grid-cols-2 gap-1 bg-neutral-800 border border-neutral-700 rounded p-1">
            {["predefined", "manual"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 text-xs font-mono font-bold rounded uppercase tracking-widest transition-all ${mode === m
                    ? "bg-yellow-400 text-black"
                    : "text-neutral-500 hover:text-neutral-300"
                  }`}
              >
                {m === "predefined" ? "Predefinit" : "Manual"}
              </button>
            ))}
          </div>

          {/* ===== MODE PREDEFINIT ===== */}
          {mode === "predefined" && (
            <>
              <ProductSelector
                selectedProduct={selectedProduct}
                onSelect={handleSelectProduct}
              />

              <FormatSelector
                selectedProduct={selectedProduct}
                selectedFormat={selectedFormat}
                onSelect={handleSelectFormat}
              />

              {/* Alçada palet */}
              {isPallet && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Alçada del palet (cm)
                  </span>
                  <input
                    type="number"
                    value={palletHeightCm}
                    onChange={(e) => setPalletHeightCm(e.target.value)}
                    placeholder="ex: 120"
                    min={1}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400"
                  />
                </div>
              )}

              <QuantityControl quantity={quantity} onChange={setQuantity} />

              <LinePreview
                selectedProduct={selectedProduct}
                selectedFormat={selectedFormat}
                quantity={quantity}
                palletHeightCm={palletHeightCm ? parseFloat(palletHeightCm) : null}
              />

              <button
                onClick={handleAddLine}
                disabled={!canAdd}
                className="w-full bg-yellow-400 text-black font-mono font-bold text-sm py-3 rounded uppercase tracking-widest hover:bg-yellow-300 transition-all disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
              >
                + Afegir a la càrrega
              </button>
            </>
          )}

          {/* ===== MODE MANUAL ===== */}
          {mode === "manual" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Descripció</span>
                <input type="text" placeholder="Nom del producte" className="bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Pes unitari (kg)</span>
                  <input type="number" placeholder="0.000" min={0} step={0.001} className="bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Volum unitari (m³)</span>
                  <input type="number" placeholder="0.0000" min={0} step={0.0001} className="bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-sm px-3 py-2 rounded outline-none focus:border-yellow-400" />
                </div>
              </div>
              <QuantityControl quantity={quantity} onChange={setQuantity} />
              <button className="w-full bg-yellow-400 text-black font-mono font-bold text-sm py-3 rounded uppercase tracking-widest hover:bg-yellow-300 transition-all">
                + Afegir a la càrrega
              </button>
              <p className="text-xs font-mono text-neutral-600 text-center">Mode manual pendent de connectar</p>
            </div>
          )}

        </section>

        {/* ===== PANEL DRET: Càrrega ===== */}
        <section className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Càrrega actual
            </span>
            <span className="text-xs font-mono bg-neutral-800 border border-neutral-700 text-neutral-500 px-3 py-1 rounded-full">
              {totals.lineCount} {totals.lineCount === 1 ? "línia" : "línies"}
            </span>
          </div>

          {/* Línies */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-lg py-16 gap-2">
              <span className="text-neutral-600 font-mono text-sm">Cap línia afegida</span>
              <span className="text-neutral-700 font-mono text-xs">Selecciona model, format i quantitat</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map((line) => (
                <CartLine key={line.id} line={line} onRemove={removeLine} />
              ))}
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && <CartTotals totals={totals} />}

        </section>
      </main>

      {/* ===== MODAL ===== */}
      {showModal && (
        <DeliveryModal cart={cart} onClose={() => setShowModal(false)} />
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs px-5 py-2.5 rounded-full border transition-all ${toast.type === "error"
            ? "bg-neutral-900 border-red-500 text-red-400"
            : "bg-neutral-900 border-green-500 text-green-400"
          }`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}