function createMemo({ ttlMs = 1000 } = {}) {
  const cache = new Map();
  return async function memo(key, load) {
    if (typeof key !== 'string' || typeof load !== 'function') {
      throw new TypeError('memo(key, load) expects a string key and function');
    }
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && (hit.pending || hit.expiresAt > now)) return hit.promise;

    const entry = { pending: true, expiresAt: 0, promise: null };
    entry.promise = Promise.resolve().then(load).then(
      (value) => {
        entry.pending = false;
        entry.expiresAt = Date.now() + ttlMs;
        return value;
      },
      (error) => {
        cache.delete(key);
        throw error;
      }
    );
    cache.set(key, entry);
    return entry.promise;
  };
}

module.exports = { createMemo };
