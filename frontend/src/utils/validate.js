export function isEmail(value = "") {
  const parts = String(value).trim().split("@");
  return (
    parts.length === 2 && parts[0].length > 0 && parts[1].includes(".")
  );
}
