'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function generateCouponCode(reviewId: string | null): string {
  const raw = (reviewId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!raw) return 'RMEWELCOME';
  const tail = raw.slice(-7).padStart(7, '0');
  return `RME${tail}`;
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9H19V19H9V9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M5 15H5C3.895 15 3 14.105 3 13V5C3 3.895 3.895 3 5 3H13C14.105 3 15 3.895 15 5V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TYStars() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/stars/ty_stars.svg" alt="Stars" className="w-16 h-16" draggable={false} />;
}

function ScratchCard({
  revealed,
  onReveal,
  children,
}: {
  revealed: boolean;
  onReveal: () => void;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDownRef = useRef(false);
  const revealedRef = useRef(revealed);
  const scratchCountRef = useRef(0);

  useEffect(() => {
    revealedRef.current = revealed;
    if (!revealed) {
      scratchCountRef.current = 0;
    }
  }, [revealed]);

  const redraw = () => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Base scratch layer
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stripe texture
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let x = -h; x < w + h; x += 18) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate((35 * Math.PI) / 180);
      ctx.fillRect(0, 0, 10, h * 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  const getRelativePoint = (ev: PointerEvent) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return { x: 0, y: 0 };
    const rect = wrapper.getBoundingClientRect();
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top,
    };
  };

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const radius = 22;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const maybeReveal = () => {
    if (revealedRef.current) return;
    if (scratchCountRef.current >= 3) {
      onReveal();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Sample a sparse grid of pixels for performance.
    const w = canvas.width;
    const h = canvas.height;
    const step = 28; // in device pixels
    const img = ctx.getImageData(0, 0, w, h).data;
    let transparent = 0;
    let total = 0;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4 + 3;
        const a = img[idx];
        total += 1;
        if (a < 40) transparent += 1;
      }
    }

    const ratio = total ? transparent / total : 0;
    if (ratio >= 0.3) onReveal();
  };

  const registerScratch = () => {
    if (revealedRef.current) return;
    scratchCountRef.current += 1;
    if (scratchCountRef.current >= 3) {
      onReveal();
    }
  };

  useEffect(() => {
    if (revealed) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    redraw();

    const ro = new ResizeObserver(() => redraw());
    ro.observe(wrapper);

    const onPointerDown = (ev: PointerEvent) => {
      if (revealedRef.current) return;
      isDownRef.current = true;
      (ev.target as HTMLElement | null)?.setPointerCapture?.(ev.pointerId);
      const p = getRelativePoint(ev);
      scratchAt(p.x, p.y);
      registerScratch();
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!isDownRef.current || revealedRef.current) return;
      const p = getRelativePoint(ev);
      scratchAt(p.x, p.y);
    };

    const onPointerUp = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;
      maybeReveal();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-[78vw] max-w-[310px] aspect-square rounded-[36px] sm:rounded-[42px] overflow-hidden shadow-2xl select-none"
      aria-label="Scratch to reveal coupon"
    >
      {children}
      {!revealed ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none cursor-pointer"
          aria-label="Scratch area"
        />
      ) : null}

    </div>
  );
}

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const reviewId = searchParams.get('reviewId');

  const couponCode = useMemo(() => generateCouponCode(reviewId), [reviewId]);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [scratched, setScratched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 450);
    const t2 = setTimeout(() => setStage(2), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Ignore clipboard errors.
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen px-4 sm:px-5 pt-8 pb-8">
        <div className="relative min-h-[calc(100vh-64px)] rounded-[44px] sm:rounded-[56px] overflow-hidden bg-gradient-to-b from-violet-700 to-violet-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />

          {/* Stage 0: just purple card */}
          <div
            className={
              stage === 0
                ? 'absolute inset-0 opacity-100 transition-opacity duration-500'
                : 'absolute inset-0 opacity-0 transition-opacity duration-500'
            }
          />

          <div className="relative z-10 h-full px-5 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-10 flex flex-col items-center">
            <div
              className={
                stage >= 1
                  ? 'opacity-100 translate-y-0 transition-all duration-500'
                  : 'opacity-0 -translate-y-2 transition-all duration-500'
              }
            >
              <div className="flex items-center justify-center">
                <div className={stage >= 1 ? 'ty-burst ty-burst--on' : 'ty-burst'}>
                  <TYStars />
                  <span className="ty-ring" />
                  <span className="ty-ring ty-ring--2" />
                  <span className="ty-spark s1" />
                  <span className="ty-spark s2" />
                  <span className="ty-spark s3" />
                  <span className="ty-spark s4" />
                  <span className="ty-spark s5" />
                  <span className="ty-spark s6" />
                  <span className="ty-spark s7" />
                  <span className="ty-spark s8" />
                </div>
              </div>

              <div className="mt-5 text-center">
                <div className="text-3xl sm:text-[40px] font-extrabold leading-[1.1] tracking-tight text-white">Thanks for reviewing!</div>
                <div className="mt-2 text-base sm:text-xl font-medium text-white/70">Businesses grow with your insights.</div>
              </div>
            </div>

            {/* Stage 2 scratch */}
            <div
              className={
                stage >= 2
                  ? 'mt-8 sm:mt-10 opacity-100 translate-y-0 transition-all duration-700'
                  : 'mt-8 sm:mt-10 opacity-0 translate-y-4 transition-all duration-700'
              }
            >
              <div className="flex items-center justify-center">
                <ScratchCard revealed={scratched} onReveal={() => setScratched(true)}>
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-yellow-500" />
                  <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.0),rgba(255,255,255,0.0)_12px,rgba(0,0,0,0.06)_12px,rgba(0,0,0,0.06)_24px)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!scratched ? <div className="text-[44px] font-extrabold text-black/45">Scratch</div> : null}
                  </div>

                  {scratched ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-2xl bg-white/40 border border-white/50 shadow-lg">
                        <div className="text-xs font-semibold text-black/50 text-center">COUPON CODE</div>
                        <div className="mt-1 text-2xl font-extrabold tracking-wider text-black/70 text-center">
                          {couponCode}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </ScratchCard>
              </div>

              {!scratched ? (
                <div className="mt-5 text-center text-white/75 text-sm font-semibold">Scratch to reveal your coupon</div>
              ) : (
                <>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-white/70">
                    <div className="text-base sm:text-lg">Coupon Code:</div>
                    <div className="text-lg sm:text-xl font-extrabold tracking-wide text-white break-all">{couponCode}</div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-white/80 hover:text-white transition-colors"
                      aria-label="Copy coupon code"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                  {copied ? <div className="mt-2 text-center text-xs text-white/75">Copied!</div> : null}
                </>
              )}
            </div>

            <div className="mt-auto pt-8 text-center text-white/70">
              <div className="text-base sm:text-lg">Wants to rate anonymous?</div>
              <Link href="/" className="text-base sm:text-lg underline text-white/85">
                Please download our App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ty-burst {
          position: relative;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          transform: scale(0.2);
          opacity: 0;
          filter: drop-shadow(0 0 0 rgba(255, 214, 102, 0));
          transition: opacity 200ms ease-out;
        }

        .ty-burst--on {
          opacity: 1;
          animation: ty-pop 900ms cubic-bezier(0.3, 1.5, 0.6, 1) forwards;
        }

        .ty-ring {
          position: absolute;
          width: 124px;
          height: 124px;
          border-radius: 999px;
          border: 2px solid rgba(255, 214, 102, 0.7);
          opacity: 0;
          transform: scale(0.2);
        }

        .ty-burst--on .ty-ring {
          animation: ty-ring 820ms ease-out forwards;
        }

        .ty-ring--2 {
          width: 82px;
          height: 82px;
          border-color: rgba(255, 236, 167, 0.55);
          animation-delay: 120ms;
        }

        .ty-spark {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: radial-gradient(circle, #fff1a6 0%, #f9c74f 60%, rgba(249, 199, 79, 0) 100%);
          opacity: 0;
        }

        .ty-burst--on .ty-spark {
          animation: ty-spark 900ms ease-out forwards;
        }

        .ty-spark.s1 { transform: translate(0, -18px); animation-delay: 80ms; }
        .ty-spark.s2 { transform: translate(16px, -8px); animation-delay: 120ms; }
        .ty-spark.s3 { transform: translate(18px, 10px); animation-delay: 160ms; }
        .ty-spark.s4 { transform: translate(0, 20px); animation-delay: 200ms; }
        .ty-spark.s5 { transform: translate(-16px, 10px); animation-delay: 140ms; }
        .ty-spark.s6 { transform: translate(-18px, -8px); animation-delay: 100ms; }
        .ty-spark.s7 { transform: translate(8px, 22px); animation-delay: 240ms; }
        .ty-spark.s8 { transform: translate(-10px, -22px); animation-delay: 220ms; }

        @keyframes ty-pop {
          0% { transform: scale(0.15) rotate(-10deg); filter: drop-shadow(0 0 0 rgba(255, 214, 102, 0)); }
          55% { transform: scale(1.18) rotate(3deg); filter: drop-shadow(0 16px 26px rgba(255, 214, 102, 0.55)); }
          80% { transform: scale(0.98) rotate(0deg); filter: drop-shadow(0 10px 16px rgba(255, 214, 102, 0.45)); }
          100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 8px 12px rgba(255, 214, 102, 0.35)); }
        }

        @keyframes ty-spark {
          0% { opacity: 0; transform: scale(0.2) translate(0, 0); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.35) translate(0px, -10px); }
        }

        @keyframes ty-ring {
          0% { opacity: 0; transform: scale(0.2); }
          35% { opacity: 0.9; }
          100% { opacity: 0; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
