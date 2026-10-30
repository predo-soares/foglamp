/** Use an explicit shared domain for sibling app/API hosts. */
export function getSharedCookieDomain(
  appUrl: string,
  authUrl: string,
  configuredDomain?: string,
) {
  const hostname = new URL(appUrl).hostname.toLowerCase();
  if (configuredDomain) {
    const domain = configuredDomain.toLowerCase().replace(/^\./, "");
    const hosts = [hostname, new URL(authUrl).hostname.toLowerCase()];
    if (!domain.includes(".") || !hosts.every(
      (host) => host === domain || host.endsWith(`.${domain}`),
    )) {
      throw new Error("AUTH_COOKIE_DOMAIN must contain both app and API hosts");
    }
    return domain;
  }
  if (
    hostname === "localhost" || hostname === "127.0.0.1" ||
    hostname === "[::1]" || hostname.endsWith(".localhost")
  ) return null;
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}
