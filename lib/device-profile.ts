export type DeviceTier = "desktop" | "tablet" | "mobile";

const TABLET_UA_PATTERN =
  /ipad|tablet|kindle|silk|playbook|sm-t|tab|nexus 7|nexus 9|nexus 10|lenovo tab|xoom/i;

const MOBILE_UA_PATTERN =
  /iphone|ipod|mobile|opera mini|opera mobi|webos|blackberry|bb10|phone/i;

export function detectDeviceTier(
  userAgent?: string | null,
  secChUaMobile?: string | null,
  secChUaPlatform?: string | null
): DeviceTier {
  const ua = (userAgent || "").toLowerCase();
  const platform = (secChUaPlatform || "").replace(/"/g, "").toLowerCase();
  const mobileHint = secChUaMobile === "?1";

  if (mobileHint || MOBILE_UA_PATTERN.test(ua) || platform === "ios") {
    return "mobile";
  }

  if (
    TABLET_UA_PATTERN.test(ua) ||
    platform === "ipados" ||
    platform === "ipad"
  ) {
    return "tablet";
  }

  if ((ua.includes("android") || platform === "android") && !ua.includes("mobile") && !mobileHint) {
    return "tablet";
  }

  return "desktop";
}
