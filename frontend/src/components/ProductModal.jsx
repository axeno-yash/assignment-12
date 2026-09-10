import React, { useState } from "react";

const STANDARD_SIZES = ["Small", "Medium", "Large", "X-Large"];
const MAX_UPLOAD_FILES = 5;
const MAX_UPLOAD_SIZE_MB = 5;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

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
  const [newFiles, setNewFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const clearError = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Product name is required.";
    if (!description.trim()) errs.description = "Description is required.";
    if (price === "" || Number.isNaN(Number(price))) {
      errs.price = "Enter a valid price.";
    } else if (Number(price) < 0) {
      errs.price = "Price cannot be negative.";
    }
    if (discountRate !== "") {
      if (Number.isNaN(Number(discountRate))) {
        errs.discountRate = "Enter a valid discount.";
      } else if (Number(discountRate) < 0 || Number(discountRate) > 100) {
        errs.discountRate = "Discount must be between 0 and 100.";
      }
    }
    if (!category) errs.category = "Choose a category.";
    const urlCount = imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean).length;
    if (urlCount + newFiles.length === 0) {
      errs.images = "Add at least one image URL or upload.";
    }
    if (variants.filter((v) => v.size.trim()).length === 0) {
      errs.variants = "Add at least one size.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };
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

  const handleFiles = (e) => {
    setFileError(null);
    const picked = Array.from(e.target.files || []);
    const valid = [];
    for (const file of picked) {
      if (newFiles.length + valid.length >= MAX_UPLOAD_FILES) {
        setFileError(`You can upload up to ${MAX_UPLOAD_FILES} images at a time`);
        break;
      }
      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        setFileError(`"${file.name}" is over ${MAX_UPLOAD_SIZE_MB}MB and was skipped`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) setNewFiles([...newFiles, ...valid]);
    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
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
    }, newFiles);
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

        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 pt-4 flex flex-col gap-5">
          <div>
            <label className={labelClass}>Product name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
              placeholder="e.g. Vertical Striped Shirt"
              className={`${inputClass} ${fieldErrors.title ? "!border-red-400" : ""}`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              placeholder="Fabric, fit and care details…"
              rows={3}
              className={`${inputClass} resize-none ${fieldErrors.description ? "!border-red-400" : ""}`}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price ($) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  clearError("price");
                }}
                placeholder="0"
                className={`${inputClass} ${fieldErrors.price ? "!border-red-400" : ""}`}
              />
              {fieldErrors.price && (
                <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.price}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Discount % (optional)</label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => {
                  setDiscountRate(e.target.value);
                  clearError("discountRate");
                }}
                className={`${inputClass} ${fieldErrors.discountRate ? "!border-red-400" : ""}`}
              />
              {fieldErrors.discountRate && (
                <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.discountRate}</p>
              )}
            </div>
          </div>
          {salePrice !== null && (
            <p className="-mt-3 text-xs font-satoshi-medium text-green-700">
              Sells at ${salePrice} after discount
            </p>
          )}

          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                clearError("category");
              }}
              className={`${inputClass} cursor-pointer ${fieldErrors.category ? "!border-red-400" : ""}`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.category}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-satoshi-bold text-black">
                Images *
              </label>
              <span className="text-[11px] font-satoshi-medium text-black/40">
                {imageCount + newFiles.length} added
              </span>
            </div>
            <textarea
              value={imagesText}
              onChange={(e) => {
                setImagesText(e.target.value);
                clearError("images");
              }}
              placeholder="/public/assets/1.png (one per line)"
              rows={2}
              className={`${inputClass} resize-none ${fieldErrors.images ? "!border-red-400" : ""}`}
            />
            {fieldErrors.images && (
              <p className="mt-1 text-xs font-satoshi-medium text-red-700">{fieldErrors.images}</p>
            )}
            <label className="block mt-2 border border-dashed border-black/20 rounded-xl px-3 py-2.5 text-xs font-satoshi-medium text-black/60 hover:border-black hover:text-black transition-colors cursor-pointer text-center">
              Upload images (max {MAX_UPLOAD_FILES}, {MAX_UPLOAD_SIZE_MB}MB each)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>
            {fileError && (
              <p className="mt-1.5 text-xs font-satoshi-medium text-red-700">{fileError}</p>
            )}
            {newFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {newFiles.map((file, idx) => (
                  <span
                    key={`${file.name}-${idx}`}
                    className="inline-flex items-center gap-1.5 bg-[#F0F0F0] rounded-full pl-3 pr-1.5 py-1 text-[11px] font-satoshi-medium text-black"
                  >
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setNewFiles(newFiles.filter((_, i) => i !== idx))}
                      className="w-5 h-5 rounded-full hover:bg-black hover:text-white transition-colors font-bold"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#F0F0F0]/50 rounded-2xl p-4">
            <label className="block text-xs font-satoshi-bold text-black mb-2">
              Sizes &amp; stock *
            </label>
            {fieldErrors.variants && (
              <p className="mb-2 text-xs font-satoshi-medium text-red-700">{fieldErrors.variants}</p>
            )}
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
