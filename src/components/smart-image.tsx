import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string };

/**
 * Image with a blurred shimmer placeholder and automatic retry when the
 * CDN request is slow or fails (common on weak mobile networks).
 */
export function SmartImage({ src, className = "", alt = "", ...rest }: Props) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const autoRetried = useRef(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  // Cached images can finish loading before React attaches onLoad.
  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setStatus("ok");
  });

  const retry = () => {
    setStatus("loading");
    setAttempt((a) => a + 1);
  };

  const onError = () => {
    if (autoRetried.current < 2) {
      autoRetried.current += 1;
      setTimeout(retry, 700 * autoRetried.current);
      return;
    }
    setStatus("error");
  };

  const url = attempt ? `${src}${src.includes("?") ? "&" : "?"}r=${attempt}` : src;

  return (
    <span className="relative block h-full w-full overflow-hidden bg-muted">
      {status !== "ok" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-secondary to-muted"
        />
      )}
      <img
        ref={imgRef}
        key={url}
        src={url}
        alt={alt}
        onLoad={() => setStatus("ok")}
        onError={onError}
        className={`${className} ${status === "ok" ? "opacity-100 blur-0" : "opacity-0 blur-md"} transition-[opacity,filter] duration-500`}
        {...rest}
      />
      {status === "error" && (
        <button
          type="button"
          onClick={retry}
          className="absolute inset-0 grid place-items-center gap-1 bg-muted/90 text-xs font-semibold text-foreground/80"
          aria-label={`Retry loading image: ${alt || "image"}`}
        >
          <RefreshCw className="h-5 w-5" />
          Tap to retry
        </button>
      )}
    </span>
  );
}
