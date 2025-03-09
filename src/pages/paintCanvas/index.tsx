import { currentPsdDataIdAtom, psdDataLoadedAtom } from "@/atoms/global";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import CanvasTextLayer from "@/types/CanvasTextLayer";
import { smartColors } from "@/config/routes";
import { startSmartColorize } from "@/smartColorize/startSmartColorize";
import { useDebounceFn } from "ahooks/lib";
import { languages } from "../../config/languages";
import MainCanvas from "./MainCanvas";
// import translator from "@/utils/translator";
// import useTranslator from "@/hooks/useTranslator";

export default function PaintCanvas() {
  const [psdDataLoaded, setPsdDataLoaded] = useAtom(psdDataLoadedAtom);
  const [currentPsdDataId] = useAtom(currentPsdDataIdAtom);
  const [currentPsdData, setCurrentPsdData] = useState(
    psdDataLoaded?.find((item) => item.id === currentPsdDataId)
  );

  // const { output, status, translate } = useTranslator();
  const textLayers = currentPsdData?.layers.filter(
    (layer) => layer.type === "text"
  );
  const imageLayers = currentPsdData?.layers.filter(
    (layer) => layer.type === "image"
  );

  const [activeTextLayer, setActiveTextLayer] = useState<CanvasTextLayer>();

  const [currentText, setCurrentText] = useState<string>("");
  const [targetText, setTargetText] = useState<string>("");
  const [currentLang, setCurrentLang] = useState<string>("eng_Latn");
  const [targetLang, setTargetLang] = useState<string>("eng_Latn");

  // useEffect(() => {
  //   setTargetText(output);
  // }, [output]);

  useEffect(() => {
    setCurrentText(activeTextLayer?.text ?? "");
  }, [activeTextLayer]);

  const { run: updateCurrentTextLayer } = useDebounceFn(
    (newText) => {
      setCurrentText(newText);
      if (activeTextLayer) {
        activeTextLayer.text = newText;
        setPsdDataLoaded([...psdDataLoaded]);
      }
    },
    {
      wait: 400,
    }
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        width={"200px"}
        display={"flex"}
        flexShrink={0}
        flexDirection={"column"}
        alignItems={"flex-start"}
        height={"100%"}
      >
        {[currentPsdData].map((item) => {
          const textLayers = item?.layers.filter(
            (layer) => layer.type === "text"
          );
          const imageLayers = item?.layers.filter(
            (layer) => layer.type === "image"
          );
          return (
            <Box
              key={item?.image}
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  transform: "scale(0.1)",
                  transformOrigin: "left top",
                }}
              >
                <MainCanvas
                  imageLayers={imageLayers ?? []}
                  textLayers={textLayers ?? []}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          flex: 1,
          background: "#f2f2f2",
          overflow: "auto",
        }}
      >
        <MainCanvas
          scale={0.34}
          imageLayers={imageLayers ?? []}
          textLayers={textLayers ?? []}
          onClick={(textLayer) => {
            setActiveTextLayer(textLayer);
          }}
        />
      </Box>
      <Box
        width={"300px"}
        sx={{
          padding: "10px",
        }}
      >
        <Typography variant="h6" component="h2">
          文字图层
        </Typography>
        <TextField
          label=""
          multiline
          fullWidth
          rows={3}
          value={currentText}
          variant="standard"
          color="primary"
          onChange={(e) => {
            updateCurrentTextLayer(e.target.value);
          }}
        />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            marginTop: "10px",
          }}
        >
          多语言翻译
        </Typography>

        <TextField
          label=""
          multiline
          fullWidth
          rows={3}
          value={targetText}
          variant="standard"
          color="primary"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flex: 1,
              padding: "10px 10px 10px 0",
            }}
          >
            <Select
              fullWidth
              value={targetLang}
              label="语言"
              variant="outlined"
              onChange={(e) => {
                setTargetLang(e.target.value);
              }}
            >
              {Object.entries(languages).map(([key, value]) => {
                return (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Button
            sx={{
              marginRight: "10px",
            }}
            variant="outlined"
            type="button"
            size="small"
            onClick={async () => {
              // translate({
              //   text: currentText,
              //   srcLang: currentLang,
              //   tgtLang: targetLang,
              // });
            }}
          >
            翻译
          </Button>
          <Button
            variant="outlined"
            type="button"
            size="small"
            onClick={async () => {
              // updateCurrentTextLayer(output);
              setTargetText("");
              setCurrentLang(targetLang);
            }}
          >
            应用
          </Button>
        </Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            marginTop: "10px",
          }}
        >
          智能配色
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            columnGap: "12px",
            rowGap: "12px",
            padding: "10px",
            justifyContent: "center",
          }}
        >
          {smartColors.slice(0, 8).map((smartColor, index) => {
            return (
              <Button
                key={index}
                style={{
                  minWidth: 0,
                  width: 50,
                  height: 50,
                  borderRadius: 4,
                  padding: "1px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (currentPsdData) {
                    const newPsdData = await startSmartColorize(
                      currentPsdData,
                      {
                        smartColor,
                        filterLayerIds: ["image_5"],
                      }
                    );
                    setCurrentPsdData(newPsdData);
                  }
                }}
              >
                <div
                  style={{
                    width: "90%",
                    height: "90%",
                    borderRadius: 4,
                    background: `rgba(${smartColor.r},${smartColor.g},${smartColor.b},${smartColor.a})`,
                  }}
                />
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
