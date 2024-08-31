export const isMobile = (window) => {
  let navigator = window?.navigator || {};
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
};
