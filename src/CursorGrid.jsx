import { useEffect, useRef, useState } from "react";

const CursorGrid = ({
  cellSize = 70,
  color = "#dab2e0",
  radius = 140,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  cellRadius = 0,
  clickPulse = false,
  pulseSpeed = 600,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const cellsRef = useRef({});
  const pulsesRef = useRef([]);
  const animationRef = useRef(null);
  const runningRef = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse tracking (with rAF throttle)
  useEffect(() => {
    let pending = false;
    let latest = { x: -9999, y: -9999 };

    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      latest = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          mouseRef.current = latest;
          pending = false;
        });
      }
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const handleClick = (e) => {
      if (!clickPulse || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      pulsesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        start: performance.now(),
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("click", handleClick);
    const container = containerRef.current;
    if (container) container.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      if (container) container.removeEventListener("mouseleave", handleLeave);
    };
  }, [clickPulse]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(size.width / cellSize) + 1;
    const rows = Math.ceil(size.height / cellSize) + 1;

    // Precompute cell centers (much faster than Math.hypot every frame)
    const centers = new Float32Array(cols * rows * 2);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 2;
        centers[i] = col * cellSize + cellSize / 2;
        centers[i + 1] = row * cellSize + cellSize / 2;
      }
    }

    // Parse hex color
    const hex = color.replace("#", "");
    const rgb = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };

    const radiusSq = radius * radius;

    // Precompute padding
    const pad = 4;
    const cellW = cellSize - pad * 2;
    const cellH = cellSize - pad * 2;
    const useRound = cellRadius > 0 && !!ctx.roundRect;

    // Determine the active bounding box around mouse (for perf)
    const getActiveBounds = (mx, my) => {
      if (mx < -1000) return null;
      const minCol = Math.max(0, Math.floor((mx - radius) / cellSize) - 1);
      const maxCol = Math.min(cols - 1, Math.ceil((mx + radius) / cellSize) + 1);
      const minRow = Math.max(0, Math.floor((my - radius) / cellSize) - 1);
      const maxRow = Math.min(rows - 1, Math.ceil((my + radius) / cellSize) + 1);
      return { minCol, maxCol, minRow, maxRow };
    };

    // Track visible "lingering" cells for fade-out
    const visibleCells = new Set();

    const render = (now) => {
      ctx.clearRect(0, 0, size.width, size.height);

      const { x: mx, y: my } = mouseRef.current;

      // Clean old pulses
      if (pulsesRef.current.length > 0) {
        pulsesRef.current = pulsesRef.current.filter(
          (p) => now - p.start < pulseSpeed
        );
      }

      // Determine which cells to draw
      const toDraw = new Set();

      // 1) Cells under mouse hover
      const bounds = getActiveBounds(mx, my);
      if (bounds) {
        for (let row = bounds.minRow; row <= bounds.maxRow; row++) {
          for (let col = bounds.minCol; col <= bounds.maxCol; col++) {
            toDraw.add(row * cols + col);
          }
        }
      }

      // 2) Cells currently fading out
      visibleCells.forEach((idx) => toDraw.add(idx));

      // 3) Cells affected by pulses
      if (pulsesRef.current.length > 0) {
        pulsesRef.current.forEach((pulse) => {
          const pBounds = getActiveBounds(pulse.x, pulse.y);
          if (pBounds) {
            for (let row = pBounds.minRow; row <= pBounds.maxRow; row++) {
              for (let col = pBounds.minCol; col <= pBounds.maxCol; col++) {
                toDraw.add(row * cols + col);
              }
            }
          }
        });
      }

      // Draw only the cells we need
      toDraw.forEach((idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const i = idx * 2;
        const cx = centers[i];
        const cy = centers[i + 1];

        let intensity = 0;
        const dx = mx - cx;
        const dy = my - cy;
        const distSq = dx * dx + dy * dy;

        // Hover
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          intensity =
            falloff === "smooth"
              ? Math.pow(1 - dist / radius, 2)
              : 1 - dist / radius;

          const key = idx;
          cellsRef.current[key] = { intensity, lastActive: now };
          visibleCells.add(idx);
        } else {
          // Fade out
          const cell = cellsRef.current[idx];
          if (cell) {
            const elapsed = now - cell.lastActive;
            if (elapsed < holdTime) {
              intensity = cell.intensity;
              visibleCells.add(idx);
            } else if (elapsed < holdTime + fadeDuration) {
              const t = 1 - (elapsed - holdTime) / fadeDuration;
              intensity = cell.intensity * t;
              visibleCells.add(idx);
            } else {
              delete cellsRef.current[idx];
              visibleCells.delete(idx);
            }
          }
        }

        // Pulses
        if (pulsesRef.current.length > 0) {
          for (let p = 0; p < pulsesRef.current.length; p++) {
            const pulse = pulsesRef.current[p];
            const pdx = pulse.x - cx;
            const pdy = pulse.y - cy;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
            const elapsed = now - pulse.start;
            const pRadius = (elapsed / pulseSpeed) * radius * 2;
            const pWidth = 60;
            if (Math.abs(pDist - pRadius) < pWidth) {
              const pIntensity =
                (1 - elapsed / pulseSpeed) *
                (1 - Math.abs(pDist - pRadius) / pWidth);
              if (pIntensity > intensity) intensity = pIntensity;
            }
          }
        }

        if (intensity <= 0.01) return;

        const alpha = Math.min(intensity * maxOpacity, 1);
        const x = col * cellSize + pad;
        const y = row * cellSize + pad;

        ctx.beginPath();
        if (useRound) {
          ctx.roundRect(x, y, cellW, cellH, cellRadius);
        } else {
          ctx.rect(x, y, cellW, cellH);
        }

        if (fillOpacity > 0) {
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${
            alpha * fillOpacity
          })`;
          ctx.fill();
        }

        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      });

      // Continue only if there's something to animate
      const hasActivity =
        mx > -1000 || visibleCells.size > 0 || pulsesRef.current.length > 0;

      if (hasActivity) {
        animationRef.current = requestAnimationFrame(render);
      } else {
        runningRef.current = false;
      }
    };

    // Wake up animation on mouse activity
    const wakeUp = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        animationRef.current = requestAnimationFrame(render);
      }
    };

    // Start immediately
    wakeUp();

    // Listen for activity to restart rendering
    const onActivity = () => wakeUp();
    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("click", onActivity);

    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("click", onActivity);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      runningRef.current = false;
    };
  }, [
    size,
    cellSize,
    color,
    radius,
    falloff,
    holdTime,
    fadeDuration,
    lineWidth,
    maxOpacity,
    fillOpacity,
    cellRadius,
    pulseSpeed,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default CursorGrid;