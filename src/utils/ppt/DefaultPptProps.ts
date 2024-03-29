import {
  logoBase64String,
  pptTemplateKey,
  primaryBarColor,
  pptBackgroundColor,
} from "../../constants/Variables";
import { ISlideConfig } from "../../types/ISlideConfig";

export const setDefaultSlideProperties = (
  pptxGenJsObj: any,
  config: ISlideConfig
) => {
  const {
    mainQuestionText,
    filters,
    chartFontFace,
    baseText,
    sourceText,
    copyRightText,
  } = config;
  pptxGenJsObj.defineSlideMaster({
    title: pptTemplateKey,
    background: { color: pptBackgroundColor },
    objects: [
      {
        rect: {
          x: 0.4,
          y: 0,
          w: 0.1,
          h: 0.5,
          fill: { color: primaryBarColor },
        },
      },
      {
        text: {
          text: mainQuestionText,
          options: {
            x: 0.5,
            y: 0.25,
            w: 8,
            fontFace: chartFontFace,
            fontSize: 12,
            color: "323c4e",
            align: "left",
            bold: true,
          },
        },
      },
      {
        text: {
          text: filters,
          options: {
            x: 0.3,
            y: 0.7,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
          },
        },
      },
      {
        text: {
          text: baseText,
          options: {
            x: 0.3,
            y: 4.8,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
            // bold: true,
          },
        },
      },
      {
        text: {
          text: sourceText,
          options: {
            x: 0.3,
            y: 4.95,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
            // bold: true,
          },
        },
      },

      {
        text: {
          text: copyRightText,
          options: {
            x: 1.6,
            y: 5.38,
            w: 2.5,
            fontFace: chartFontFace,
            fontSize: 7,
            color: "7f7f7f",
            align: "center",
          },
        },
      },
      { image: { x: 0.38, y: 5.15, w: 1.2, h: 0.4, data: logoBase64String } },
    ],
  });
};
