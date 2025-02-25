import React, { useRef } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import "./index.css";

export default function ImageWaterfallFlow({ images }: { images: string[] }) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(imageWrapperRef, {
    className: ".psdImage",
  });
  return (
    <div
      ref={imageWrapperRef}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {images.map((image, index) => {
        return (
          <div className="psdImageWrapper" key={`${image}-${index}`}>
            <img
              className="psdImage"
              width={200}
              data-src={image}
              alt={""}
            ></img>
          </div>
        );
      })}
    </div>
  );
}
