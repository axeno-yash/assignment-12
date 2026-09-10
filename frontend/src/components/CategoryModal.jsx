import React, { useState } from "react";

function CategoryModal({ category, saving = false, error = null, onClose, onSubmit }) {
  const isEdit = Boolean(category);
  const [name, setName] = useState(category?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: name.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b border-black/10">
          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-satoshi-bold uppercase tracking-wide mb-2 ${
                isEdit ? "bg-black text-white" : "bg-green-100 text-green-800"
              }`}
            >
              {isEdit ? "Edit" : "New"}
            </span>
            <h3 className="font-satoshi-bold text-lg text-black leading-tight">
              {isEdit ? category.name : "Add category"}
            </h3>
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

        <form onSubmit={handleSubmit} className="p-5 pt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-satoshi-bold text-black mb-1.5">
              Category name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hoodie"
              required
              className="w-full border border-black/20 rounded-xl px-3 py-2 text-sm font-satoshi-regular text-black focus:outline-none focus:border-black placeholder:text-black/30 bg-white"
            />
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
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
