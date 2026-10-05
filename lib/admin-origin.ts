import { headers } from "next/headers";

/** The site's origin for the current request (for permalinks shown in the admin). */
export async function siteOrigin() {
  const list = await headers();
  return `${list.get("x-forwarded-proto") ?? "http"}://${list.get("host")}`;
}
