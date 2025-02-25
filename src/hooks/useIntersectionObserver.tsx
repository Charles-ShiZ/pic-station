import React, { useEffect } from "react";

export default function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: {
    className: string;
    root?: string;
    threshold?: number;
  }
) {
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imageElement = entry.target as HTMLImageElement;
          if (entry.isIntersecting) {
            const imageElement = entry.target as HTMLImageElement;
            if (imageElement.dataset.src) {
              imageElement.src = imageElement.dataset.src;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: options.root ? document.querySelector(options.root) : null,
        threshold: options.threshold ?? 1,
      }
    );
    const imageWrapper = ref.current;
    const imageElements = [
      ...(imageWrapper?.querySelectorAll(options.className) ?? []),
    ];
    imageElements.forEach((imageElement) => observer.observe(imageElement));
    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
