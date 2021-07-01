import { useState, useMemo, useLayoutEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";

export type ElemSize = Pick<DOMRectReadOnly, "height" | "width">;
export type ElemRef<E extends Element> = (element: E) => void;

const initialState = { width: 0, height: 0 };

/**
 * Hook that tracks the content size (width and height) of a given element
 *
 * Inspired by `useMeasure` hook from `react-use` lib, but tailored to our
 * particular use case:
 *
 * - we only care about the _content box size_ of an element (width and height)
 * - ResizeObserver may fire because of layout shifts we don't care about
 * - it's important to trigger as little re-renders as possible for perf sake
 *
 * Therefore, this hook throttles updates and only changes state when either
 * _content width_ or _content height_ have changed
 */
function useInnerElemSize<E extends Element>(): [ElemRef<E>, ElemSize] {
  const [element, ref] = useState<E | null>(null);
  const [size, setSize] = useState(initialState);

  const observer = useMemo(() => {
    let rafId = 0;

    return new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
      if (!entry) return;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize((prev) => {
          const { width, height } = entry.contentRect;

          // this observer may have fired because of changes we don't care
          // so we only update local state when the values we care changed
          if (prev.width === width && prev.height === height) return prev;
          return { width, height };
        });
      });
    });
  }, []);

  useLayoutEffect(() => {
    if (!element) return;

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, observer]);

  return [ref, size];
}

export default useInnerElemSize;
