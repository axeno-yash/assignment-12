export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .split(" ")
    .filter(Boolean)
    .join("-");
}

export function categorySlug(category) {
  if (!category) return "";
  if (typeof category === "string") return slugify(category);
  return slugify(category.slug || category.name || "");
}

export function matchCategorySlug(category, param = "") {
  if (!category || param === undefined) return false;
  const p = String(param).toLowerCase().trim();
  if (String(category._id) === String(param)) return true;
  const name = String(category.name || "")
    .toLowerCase()
    .trim();
  if (name === p) return true;
  return slugify(category.name || "") === p;
}
