import { expect, test } from "bun:test";
import { getSharedCookieDomain } from "./cookie-domain";

test("sibling API and dashboard share a browser-valid parent cookie", () => {
  expect(getSharedCookieDomain(
    "https://foglamp.convivae.com", "https://foglamp-api.convivae.com", "convivae.com",
  )).toBe("convivae.com");
});
test("cookie domain cannot target an unrelated host or a partial suffix", () => {
  for (const domain of ["example.com", "com", "vivae.com"]) {
    expect(() => getSharedCookieDomain(
      "https://foglamp.convivae.com", "https://foglamp-api.convivae.com", domain,
    )).toThrow();
  }
});
test("existing hosted and local defaults remain usable", () => {
  expect(getSharedCookieDomain("https://www.foglamp.dev", "https://api.foglamp.dev")).toBe("foglamp.dev");
  expect(getSharedCookieDomain("http://localhost:3001", "http://localhost:3000")).toBeNull();
});
