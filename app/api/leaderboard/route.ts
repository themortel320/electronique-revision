import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Upstash Redis REST API helpers
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

export type LeaderboardEntry = {
  pseudo: string;
  score: number;
  correct: number;
  total: number;
  category: string;
  date: string;
};

const REDIS_KEY = "electrolab:leaderboard:v2";

// GET /api/leaderboard → returns top 30 entries
export async function GET() {
  const redis = getRedisConfig();

  if (!redis) {
    return NextResponse.json({ entries: [], source: "none" });
  }

  try {
    // ZREVRANGE leaderboard 0 29 WITHSCORES
    const result = await redisCall(redis.url, redis.token, "zrevrange", REDIS_KEY, "0", "29", "WITHSCORES");
    const raw: string[] = result.result ?? [];

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      try {
        const entry = JSON.parse(raw[i]) as LeaderboardEntry;
        entries.push(entry);
      } catch {
        // skip malformed
      }
    }

    return NextResponse.json({ entries, source: "redis" });
  } catch {
    return NextResponse.json({ entries: [], source: "error" });
  }
}

// POST /api/leaderboard → submit a score
export async function POST(req: NextRequest) {
  const redis = getRedisConfig();

  const body = (await req.json()) as LeaderboardEntry;
  if (!body.pseudo || typeof body.score !== "number") {
    return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  }

  // Sanitize pseudo
  const pseudo = body.pseudo.trim().slice(0, 20).replace(/[<>'"]/g, "");

  const entry: LeaderboardEntry = {
    pseudo,
    score: Math.min(Math.max(0, Math.round(body.score)), 100),
    correct: body.correct ?? 0,
    total: body.total ?? 10,
    category: body.category ?? "electronics",
    date: new Date().toISOString(),
  };

  if (!redis) {
    // No Redis configured — just return success (score won't be shared)
    return NextResponse.json({ ok: true, shared: false });
  }

  try {
    // Use pseudo+category as member key to allow one entry per user per category
    const member = JSON.stringify(entry);
    const memberKey = `${pseudo}:${entry.category}`;

    // Remove any existing entry for this pseudo+category before adding
    // Get current entries to find the one matching this pseudo+category
    const existing = await redisCall(redis.url, redis.token, "zrevrange", REDIS_KEY, "0", "200", "WITHSCORES");
    const raw: string[] = existing.result ?? [];
    for (let i = 0; i < raw.length; i += 2) {
      try {
        const e = JSON.parse(raw[i]) as LeaderboardEntry;
        if (e.pseudo === pseudo && e.category === entry.category) {
          // Only replace if new score is better
          if (entry.score > (e.score ?? 0)) {
            await redisCall(redis.url, redis.token, "zrem", REDIS_KEY, raw[i]);
          } else {
            return NextResponse.json({ ok: true, shared: true, improved: false });
          }
        }
      } catch {
        // skip
      }
    }

    // ZADD key score member
    await redisCall(redis.url, redis.token, "zadd", REDIS_KEY, String(entry.score), member);
    void memberKey; // used for logic above

    return NextResponse.json({ ok: true, shared: true, improved: true });
  } catch {
    return NextResponse.json({ ok: true, shared: false });
  }
}
