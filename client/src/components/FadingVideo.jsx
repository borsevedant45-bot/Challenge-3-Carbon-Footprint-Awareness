import React, { useRef, useEffect, useCallback } from 'react';

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

function FadingVideo({ src, className, style, poster }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const fadingOutRef = useRef(false);
  const startTimeRef = useRef(null);

  const fadeTo = useCallback((targetOpacity, duration) => {
    const video = videoRef.current;
    if (!video) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startOpacity = parseFloat(video.style.opacity) || 1;
    const diff = targetOpacity - startOpacity;
    startTimeRef.current = null;

    function animate(now) {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      video.style.opacity = startOpacity + diff * t;
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedData = () => {
      video.style.opacity = '0';
      video.play();
      fadeTo(1, FADE_MS);
    };

    const onTimeUpdate = () => {
      if (fadingOutRef.current) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const onEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
        fadingOutRef.current = false;
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [fadeTo]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ ...style, opacity: 0 }}
    />
  );
}

export default React.memo(FadingVideo);
