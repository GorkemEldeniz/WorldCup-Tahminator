const BASE = "https://api.football-data.org/v4";

export async function footballDataGet<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN ?? "" },
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`football-data ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}
