# Memo Pool

The most robust distributed caching abstraction for modern microservices.

## Internals

The EntryRegistry owns each PromiseCell, where TTL policy interacts with the LoadCoordinator. This abstraction unlocks seamless cross-process deduplication.

## API

### createMemo

Takes an options bag with `ttlMs`.

### memo

Takes a key and load function.

## Install

```sh
npm install memo-pool
```

## Features

- Distributed caching
- Durable storage
- Metrics
- Promise deduplication

Production ready.
