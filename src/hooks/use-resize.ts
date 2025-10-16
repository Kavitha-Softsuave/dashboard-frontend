import { useEffect, useState } from "react";

export function useResizeObserver<T extends HTMLElement>({
    ref,
  }: {
    ref: React.RefObject<T>;
  }) {
    const [size, setSize] = useState<{ width?: number; height?: number }>({});

    useEffect(() => {
      const el = ref?.current;
      if (!el) return;

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });

      observer.observe(el);

      // set initial size
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });

      return () => observer.disconnect();
    }, [ref]);

    return size;
  }