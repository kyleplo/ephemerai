const rateLimit = 20;

export async function doRateLimit(ip: string, ctx: ExecutionContext): Promise<number> {
  var callCount = 0;
  const cache = await caches.default.match("https://ephemerai.kyleplo.com/ai?ip=" + ip);
  try {
    const cacheData = cache && (await cache.json()) as { count: number; };
    if (cacheData && cacheData.count >= rateLimit) {
      throw null;
    }
    callCount = (cacheData ? cacheData.count + 1 : 1);
    ctx.waitUntil(caches.default.put("https://ephemerai.kyleplo.com/ai?ip=" + ip, new Response(JSON.stringify({
      count: callCount
    }), {
      headers: {
        "Cache-Control": "public, max-age=3600, immutable"
      }
    })));
  } catch (_e) {
    callCount = rateLimit;
  }
  return rateLimit - callCount;
}

export async function performRateLimitTest (ip: string, ctx: ExecutionContext): Promise<Response> {
  return new Response(JSON.stringify({
      remainingCalls: await doRateLimit(ip, ctx)
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
}