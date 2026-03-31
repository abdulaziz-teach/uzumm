export const publicAsset = (path = "") => {
  const value = String(path || "").trim();
  if (!value) return "";
  if (/^(?:https?:)?\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const normalized = value.replace(/^\.?\/*/, "");
  return `${import.meta.env.BASE_URL}${normalized}`;
};
