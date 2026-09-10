import React, { useState } from "react";

const STANDARD_SIZES = ["Small", "Medium", "Large", "X-Large"];

function ProductModal({ product, categories = [], saving = false, error = null, onClose, onSubmit }) {
  const isEdit = Boolean(product);
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [discountRate, setDiscountRate] = useState(product?.discountRate ?? 0);
  const [category, setCategory] = useState(
    product?.category?._id || product?.category || ""
  );
  const [imagesText, setImagesText] = useState((product?.images || []).join("\n"));
  const [variants, setVariants] = useState(() => {
    const existing = product?.variants || [];
    const qtyOf = (size) => {
      const found = existing.find(
        (v) => String(v.size).toLowerCase() === size.toLowerCase()
      );
      return Number(found?.quantity) || 0;
    };
    const standard = STANDARD_SIZES.map((size) => ({ size, quantity: qtyOf(size) }));
    const extras = existing
      .filter(
        (v) => !STANDARD_SIZES.some((s) => s.toLowerCase() === String(v.size).toLowerCase())
      )
      .map((v) => ({ size: String(v.size), quantity: Number(v.quantity) || 0 }));
    return [...standard, ...extras];
  });

  const changeQty = (idx, qty) => {
    setVariants(
      variants.map((v, i) => (i === idx ? { ...v, quantity: Math.max(0, qty) } : v))
    );
  };

  const imageCount = imagesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;

  const salePrice =
    price !== "" && Number(discountRate) > 0
      ? Math.round(Number(price) * (1 - Number(discountRate) / 100))
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      discountRate: Number(discountRate) || 0,
      images: imagesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      variants: variants.map((v) => ({
        size: v.size,
        quantity: Math.max(0, Number(v.quantity) || 0),
      })),
      category,
    });
  };

  const inputClass =
    "w-full border border-black/20 rounded-xl px-3 py-2 text-sm font-satoshi-regular text-black focus:outline-none focus:border-black placeholder:text-black/30 bg-white";
  const labelClass = "block text-xs font-satoshi-bold text-black mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[24px] shadow-2xl w-full sm:max-w-xl max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-black/10">
          <div className="min-w-0">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-satoshi-bold uppercase tracking-wide mb-2 ${
                isEdit ? "bg-black text-white" : "bg-green-100 text-green-800"
              }`}
            >
              {isEdit ? "Edit" : "New"}
            </span>
            <h3 className="font-satoshi-bold text-lg text-black leading-tight truncate">
              {isEdit ? product.title : "Add product"}
            </h3>
            <p className="text-xs text-black/50 mt-0.5 font-satoshi-regular">
              {isEdit
                ? `${product?.category?.name || "Apparel"} • $${product?.price}`
                : "Fill the details below to add it to the catalog"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-black/40 hover:text-black transition-colors text-xl leading-none flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 pt-4 flex flex-col gap-5">
          <div>
            <label className={labelClass}>Product name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vertical Striped Shirt"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric, fit and care details…"
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          {salePrice !== null && (
            <p className="-mt-3 text-xs font-satoshi-medium text-green-700">
              Sells at ${salePrice} after discount
            </p>
          )}

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-satoshi-bold text-black">
                Images
              </label>
              <span className="text-[11px] font-satoshi-medium text-black/40">
                {imageCount} added
              </span>
            </div>
            <textarea
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="/public/assets/1.png (one per line)"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="bg-[#F0F0F0]/50 rounded-2xl p-4">
            <label className="block text-xs font-satoshi-bold text-black mb-2">
              Sizes &amp; stock
            </label>
            <div className="space-y-2">
              {variants.map((variant, idx) => (
                <div
                  key={variant.size}
                  className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-2.5"
                >
                  <span className="font-satoshi-bold text-sm text-black w-20">
                    {variant.size}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={variant.quantity <= 0}
                      onClick={() => changeQty(idx, variant.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-base font-satoshi-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={variant.quantity}
                      onChange={(e) => changeQty(idx, Number(e.target.value) || 0)}
                      className="w-16 text-center border border-black/20 rounded-lg py-1 text-sm font-satoshi-bold text-black focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => changeQty(idx, variant.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-base font-satoshi-bold text-black hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span
                    className={`text-xs font-satoshi-medium w-12 text-right ${
                      variant.quantity <= 0
                        ? "text-red-600"
                        : variant.quantity <= 5
                          ? "text-amber-600"
                          : "text-green-700"
                    }`}
                  >
                    {variant.quantity <= 0 ? "Out" : variant.quantity <= 5 ? "Low" : "OK"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-xs font-satoshi-medium px-4 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-black/20 text-sm font-satoshi-medium text-black/70 hover:border-black hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-satoshi-bold hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
