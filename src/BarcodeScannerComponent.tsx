import React from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import Webcam from "react-webcam";

const BarcodeScannerComponent = ({
  width,
  height,
  onUpdate,
  facingMode = "environment",
  delay = 500,
  videoConstraints,
}: {
  width: number;
  height: number;
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  facingMode: "environment" | "user";
  delay?: number;
  videoConstraints?: MediaTrackConstraints;
}): React.ReactElement => {
  const webcamRef = React.useRef(null);
  const codeReader = new BrowserMultiFormatReader();

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (imageSrc) {
      codeReader
        .decodeFromImage(undefined, imageSrc)
        .then((result) => {
          onUpdate(null, result);
        })
        .catch((err) => {
          onUpdate(err);
        });
    }
  }, [codeReader, onUpdate]);

  React.useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Webcam
      width={width}
      height={height}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={
        videoConstraints || {
          facingMode,
        }
      }
      audio={false}
    />
  );
};

export default BarcodeScannerComponent;
