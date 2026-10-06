/**
 * 24 FPS Global Frame Limiter
 * 
 * Intercepts window.requestAnimationFrame and window.cancelAnimationFrame
 * to lock all client-side JavaScript render loops (Three.js, WebGL shaders,
 * UI canvas, Framer Motion, and cursor tracking) to an authentic 24 frames per second
 * cinematic film cadence (41.667ms per frame).
 */

const TARGET_FPS = 24;
const FRAME_DURATION = 1000 / TARGET_FPS; // 41.666666666666664 ms
const TOLERANCE_MS = 1.0; // Sub-millisecond display vsync tolerance

const nativeRAF = typeof window !== 'undefined' && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : (cb) => setTimeout(() => cb(performance.now()), FRAME_DURATION);

const nativeCAF = typeof window !== 'undefined' && window.cancelAnimationFrame
  ? window.cancelAnimationFrame.bind(window)
  : (id) => clearTimeout(id);

const callbacks = new Map();
let nextId = 1;
let nativeRafId = null;
let lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
const cancelledThisFrame = new Set();
let isDispatching = false;

function loop(timestamp) {
  nativeRafId = nativeRAF(loop);

  const delta = timestamp - lastFrameTime;

  // Trigger when 1/24th of a second has passed
  if (delta >= FRAME_DURATION - TOLERANCE_MS) {
    // Prevent time drift from accumulating, while gracefully handling background tab wakeups
    if (delta > FRAME_DURATION * 3) {
      lastFrameTime = timestamp;
    } else {
      lastFrameTime = timestamp - (delta % FRAME_DURATION);
    }

    if (callbacks.size > 0) {
      // Snapshot callbacks scheduled for this specific 24fps frame
      const currentBatch = Array.from(callbacks.entries());
      callbacks.clear();
      cancelledThisFrame.clear();

      isDispatching = true;
      for (let i = 0; i < currentBatch.length; i++) {
        const [id, cb] = currentBatch[i];
        if (cancelledThisFrame.has(id)) continue;
        try {
          cb(timestamp);
        } catch (err) {
          console.error('[24fps Limiter] Animation callback exception:', err);
        }
      }
      isDispatching = false;
      cancelledThisFrame.clear();
    }
  }
}

function customRequestAnimationFrame(callback) {
  const id = nextId++;
  callbacks.set(id, callback);

  if (nativeRafId === null) {
    lastFrameTime = performance.now();
    nativeRafId = nativeRAF(loop);
  }

  return id;
}

function customCancelAnimationFrame(id) {
  callbacks.delete(id);
  if (isDispatching) {
    cancelledThisFrame.add(id);
  }
}

// Install globally in browser context
if (typeof window !== 'undefined') {
  window.requestAnimationFrame = customRequestAnimationFrame;
  window.cancelAnimationFrame = customCancelAnimationFrame;
  window.__ATELIER_TARGET_FPS__ = TARGET_FPS;
}

export {
  TARGET_FPS,
  FRAME_DURATION,
  nativeRAF,
  nativeCAF,
  customRequestAnimationFrame,
  customCancelAnimationFrame,
};
