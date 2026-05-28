import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCall(url: string, token: string, ...args: (string | number)[]) {
  const res = await fetch(`${url}/${args.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Returns "YYYY-WXX" for the current ISO week
function weekKey(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function pseudoSetKey() {
  return `electrolab:pseudos:${weekKey()}`;
}

// GET /api/pseudo?name=xxx&token=yyy → check if pseudo is available or owned by token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.trim().slice(0, 20);
  const userToken = searchParams.get("token");

  if (!name) return NextResponse.json({ available: false, error: "Missing name" });

  const redis = getRedisConfig();
  if (!redis) return NextResponse.json({ available: true }); // No Redis = no check

  try {
    // HGET pseudos-key pseudo → returns the token of who owns it
    const result = await redisCall(redis.url, redis.token, "hget", pseudoSetKey(), name.toLowerCase());
    const ownerToken = result.result;

    if (!ownerToken) return NextResponse.json({ available: true });
    if (userToken && ownerToken === userToken) return NextResponse.json({ available: true, owned: true });

    return NextResponse.json({ available: false });
  } catch {
    return NextResponse.json({ available: true });
  }
}

// POST /api/pseudo { name, token } → reserve a pseudo for this week
export async function POST(req: NextRequest) {
  const { name: rawName, token: userToken } = (await req.json()) as { name: string; token: string };

  const name = rawName?.trim().slice(0, 20).replace(/[<>'"]/g, "");
  if (!name || !userToken) {
    return NextResponse.json({ ok: false, error: "Invalid" }, { status: 400 });
  }

  const redis = getRedisConfig();
  if (!redis) return NextResponse.json({ ok: true, shared: false });

  try {
    const key = pseudoSetKey();

    // Check if pseudo is already taken by someone else
    const existing = await redisCall(redis.url, redis.token, "hget", key, name.toLowerCase());
    const ownerToken = existing.result;

    if (ownerToken && ownerToken !== userToken) {
      return NextResponse.json({ ok: false, taken: true });
    }

    // Reserve pseudo (TTL: 8 days to cover the full week + buffer)
    await redisCall(redis.url, redis.token, "hset", key, name.toLowerCase(), userToken);
    await redisCall(redis.url, redis.token, "expire", key, String(8 * 24 * 3600));

    return NextResponse.json({ ok: true, taken: false });
  } catch {
    return NextResponse.json({ ok: true, shared: false });
  }
}
