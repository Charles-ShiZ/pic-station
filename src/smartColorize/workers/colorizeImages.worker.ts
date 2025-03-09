import { colorizeImages } from "../colorizeImages";

self.onmessage = async (e) => {
  const { smartHSL, imageLayers: imageLayersFiltered } = e.data;
  const newImageLayers = await colorizeImages({
    smartHSL,
    imageLayers: imageLayersFiltered,
  });

  self.postMessage(newImageLayers);
};
