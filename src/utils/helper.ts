export const getFileTypeLabel = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "File Attached";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "Image";
  if (["pdf"].includes(ext)) return "PDF Document";
  if (["docx", "doc"].includes(ext)) return "Word Document";
  return "File Attached";
};

export const isValidHttpUrl = (text: string) => {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};
