import React from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import Webcam from "react-webcam";

const BarcodeScannerComponent = ({
  onUpdate,
  width = "100%",
  height = "100%",
  facingMode = "environment",
  delay = 500,
  videoConstraints,
  stopStream,
}: {
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  width?: number | string;
  height?: number | string;
  facingMode?: "environment" | "user";
  delay?: number;
  videoConstraints?: MediaTrackConstraints;
  stopStream?: boolean;
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
    if (stopStream) {
      let stream = webcamRef?.current?.video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track: any) => {
          stream.removeTrack(track);
          track.stop();
        });
        stream = null;
      }
    }
  }, [stopStream]);

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
      screenshotFormat="image/jpeg"
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
