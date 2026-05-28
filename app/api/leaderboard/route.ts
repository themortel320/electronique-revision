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

export type LeaderboardEntry = {
  pseudo: string;
  score: number;
  correct: number;
  total: number;
  category: string;
  date: string;
};

// Returns "YYYY-WXX" for the current ISO week
function weekKey(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

// Next Monday at 00:00 UTC
function nextResetDate(): string {
  const now = new Date();
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + daysUntilMonday);
  next.setUTCHours(0, 0, 0, 0);
  return next.toISOString();
}

function leaderboardKey() {
  return `electrolab:lb:${weekKey()}`;
}

// GET /api/leaderboard → returns top 30 entries for current week
export async function GET() {
  const redis = getRedisConfig();
  const resetDate = nextResetDate();
  const week = weekKey();

  if (!redis) {
    return NextResponse.json({ entries: [], source: "none", resetDate, week });
  }

  try {
    const result = await redisCall(redis.url, redis.token, "zrevrange", leaderboardKey(), "0", "29", "WITHSCORES");
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

    return NextResponse.json({ entries, source: "redis", resetDate, week });
  } catch {
    return NextResponse.json({ entries: [], source: "error", resetDate, week });
  }
}

// POST /api/leaderboard → submit a score
export async function POST(req: NextRequest) {
  const redis = getRedisConfig();
  const resetDate = nextResetDate();

  const body = (await req.json()) as LeaderboardEntry & { userToken?: string };
  if (!body.pseudo || typeof body.score !== "number") {
    return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  }

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
    return NextResponse.json({ ok: true, shared: false, resetDate });
  }

  try {
    const key = leaderboardKey();

    // Find and remove existing entry for this pseudo+category (keep best score)
    const existing = await redisCall(redis.url, redis.token, "zrevrange", key, "0", "500", "WITHSCORES");
    const raw: string[] = existing.result ?? [];
    for (let i = 0; i < raw.length; i += 2) {
      try {
        const e = JSON.parse(raw[i]) as LeaderboardEntry;
        if (e.pseudo === pseudo && e.category === entry.category) {
          if (entry.score > (e.score ?? 0)) {
            await redisCall(redis.url, redis.token, "zrem", key, raw[i]);
          } else {
            return NextResponse.json({ ok: true, shared: true, improved: false, resetDate });
          }
        }
      } catch {
        // skip
      }
    }

    // Add new entry — score is used as Redis sorted set score
    await redisCall(redis.url, redis.token, "zadd", key, String(entry.score), JSON.stringify(entry));
    // Set TTL: 14 days to ensure cleanup
    await redisCall(redis.url, redis.token, "expire", key, String(14 * 24 * 3600));

    return NextResponse.json({ ok: true, shared: true, improved: true, resetDate });
  } catch {
    return NextResponse.json({ ok: true, shared: false, resetDate });
  }
}
