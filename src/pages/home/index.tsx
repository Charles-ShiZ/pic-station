import React from "react";
import ImageWaterfallFlow from "../../components/ImageWaterfallFlow";
import { UploadPsd } from "@/components/UploadPsd";

export default function Home() {
  return (
    <div>
      <UploadPsd></UploadPsd>
      <ImageWaterfallFlow
        images={[
          "http://localhost:3001/images/aggressive-progressive.jpg",
          "http://localhost:3001/images/aggressive-progressive.jpg",
          "http://localhost:3001/images/pexels-sefaturksoy.jpeg",
          "http://localhost:3001/images/pexels-sefaturksoy.jpg",
          "http://localhost:3001/images/image-06a0ff66e6b6a1411014a65ff780e521.png",
          "http://localhost:3001/images/image-9f2d8c3315edb6774b15d73227e51b51.png",
          "http://localhost:3001/images/image-4825ed2d8f751c4af80d0f396f7cb1e0.png",
          "http://localhost:3001/images/image-8471f178c165381c90eff00b8d09705b.png",
          "http://localhost:3001/images/image-08968318f203938cf000bca28e647cd5.png",
          "http://localhost:3001/images/image-b4d606324aa339a124382c4b9025d5d7.png",
          "http://localhost:3001/images/image-b890f843a8e96810fcb562324012d6b5.png",
        ]}
      />
    </div>
  );
}
