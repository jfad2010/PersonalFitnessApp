import localforage from 'localforage';

type QueuedRequest = {
  url: string;
  method: string;
  body: any;
};

const store = localforage.createInstance({
  name: 'gymtrack-ai',
  storeName: 'offline-queue',
});

export async function queueRequest(url: string, method: string, body: any) {
  const queue = (await store.getItem<QueuedRequest[]>('queue')) || [];
  queue.push({ url, method, body });
  await store.setItem('queue', queue);
}

export async function flushQueue() {
  const queue = (await store.getItem<QueuedRequest[]>('queue')) || [];
  const remaining: QueuedRequest[] = [];
  for (const req of queue) {
    try {
      const res = await fetch(req.url, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      remaining.push(req);
    }
  }
  await store.setItem('queue', remaining);
}

// Try flush on load if online
if (typeof window !== 'undefined' && navigator.onLine) {
  flushQueue();
}

// Listen for reconnect
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => flushQueue());
}
