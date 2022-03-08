import React, { FC, useEffect, useRef } from "react";
import { DokiTheme } from "./DokiTheme";
import { svgToPng } from "../background/svgTools";

interface Props {
  theme: DokiTheme;
  width: number;
  height: number;
}

function styleComponent(
  ref: React.MutableRefObject<null>,
  width: number,
  height: number,
  dokiTheme: DokiTheme
) {
  if (ref && ref.current) {
    const divGuy: HTMLElement = ref.current;
    svgToPng(dokiTheme, { width, height }).then((imgData) => {
      divGuy?.childNodes?.forEach((node) => {
        divGuy.removeChild(node);
      });
      const pngImage = document.createElement("img");
      divGuy!.appendChild(pngImage);
      pngImage.src = imgData;
    });
  }
}

const DokiIcon: FC<Props> = ({ width, height, theme }) => {
  const ref = useRef(null);

  useEffect(() => {
    styleComponent(ref, width, height, theme);
  }, [ref, width, height, theme]);

  return <div ref={ref}></div>;
};

export default DokiIcon;
