import React, { useLayoutEffect, useRef } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import "./index.css";
import * as styles from "./index.module.css";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import { ImageListItem } from "@mui/material";
import { useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import {
  activeTabItemAtom,
  currentPsdDataIdAtom,
  psdDataLoadedAtom,
} from "@/atoms/global";
import routes from "@/config/routes";
import { psdData } from "@/const";

export default function ImageWaterfallFlow({
  imageItems,
}: {
  imageItems: typeof psdData;
}) {
  console.log("%c👉 * as : ", "background:#41b883", styles); // 🐵

  const cols = 4;
  const gap = 8;
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(imageWrapperRef, {
    className: ".psdImage",
  });
  const navigate = useNavigate();
  const setActiveTabItem = useSetAtom(activeTabItemAtom);
  const [psdDataLoaded, setPsdDataLoaded] = useAtom(psdDataLoadedAtom);
  const [currentPsdDataId, setCurrentPsdDataId] = useAtom(currentPsdDataIdAtom);

  // useLayoutEffect(() => {
  //   const imageWrapper = imageWrapperRef.current!;
  //   const imageActualWidth = (imageWrapper.clientWidth - (cols - 1) * 8) / cols;
  //   console.log(
  //     "%c👉 imageActualWidth: ",
  //     "background:#41b883",
  //     imageActualWidth
  //   ); // 🐵
  //   console.log(imageWrapper.children[0].children);
  // }, []);
  return (
    <div
      ref={imageWrapperRef}
      className={styles.cssModule}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* {images.map((image, index) => {
        return (
          <Box
            className="psdImageWrapper"
            sx={{
              width: 200,
            }}
            key={`${image}-${index}`}
          >
            <Image
              className="psdImage"
              width={200}
              data-src={image}
              alt={""}
            ></Image>
          </Box>
        );
      })} */}
      <ImageList variant="masonry" cols={cols} gap={gap}>
        {imageItems.map((imageItem, index) => {
          const imageSrc = imageItem.image_webp || imageItem.image;
          return (
            <ImageListItem key={`${imageItem.image}_${index}`}>
              <img
                data-width={imageItem.width}
                data-height={imageItem.height}
                srcSet={imageSrc}
                src={imageSrc}
                alt={imageSrc}
                onClick={() => {
                  const activeTabItem = routes.find(
                    ({ path }) => path === "/paintCanvas"
                  );
                  if (activeTabItem) {
                    navigate(activeTabItem.path);
                    setActiveTabItem(activeTabItem);
                    psdDataLoaded.push(imageItem);
                    setCurrentPsdDataId(imageItem.id);
                    setPsdDataLoaded([...psdDataLoaded]);
                  }
                }}
              />
            </ImageListItem>
          );
        })}
      </ImageList>
    </div>
  );
}
