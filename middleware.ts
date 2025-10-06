import type { MiddlewareHandler } from "astro";

const unauthorized = () =>
  new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  // Nur aktiv in Prod/Preview. Für lokales Dev auskommentieren falls nötig.
  if (import.meta.env.MODE === "development") return next();

  const user = import.meta.env.BASIC_USER;
  const pass = import.meta.env.BASIC_PASS;
  if (!user || !pass) return unauthorized();

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const [u, p] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (u !== user || p !== pass) return unauthorized();
  return next();
};
