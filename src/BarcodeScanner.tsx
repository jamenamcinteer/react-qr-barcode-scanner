import React, { useCallback, useEffect, useRef } from "react";
import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  Result,
} from "@zxing/library";
import Webcam from "react-webcam";
import { BarcodeStringFormat } from "./BarcodeStringFormat";

// Extend MediaTrackCapabilities globally to include the 'torch' property
declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }
}

export const BarcodeScanner = ({
  onUpdate,
  onError,
  width = "100%",
  height = "100%",
  facingMode = "environment",
  torch,
  delay = 500,
  videoConstraints,
  stopStream,
  formats,
}: {
  /**
   * Function that returns the result for every captured frame. Text from barcode can be accessed from result.getText() if there is a result.
   * @param arg0 Error message or null
   * @param arg1 result of the scan
   * @returns
   */
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  /**
   * If passed to the component, this function is called when there is an error with the camera (rather than with with reading the QR code, which would be passed to onUpdate). An example would be an error thrown when the user does not allow the required camera permission.
   * @param arg0 Error message or DOMException
   * @returns
   */
  onError?: (arg0: string | DOMException) => void;
  /**
   * The width of the video element. Default is "100%".
   * Can be a number (in pixels) or a string (e.g. "100%").
   * If a number is provided, it will be converted to a string with "px" appended.
   * If a string is provided, it will be used as-is.
   * @example
   * width={500} // 500px
   * width="100%" // 100% of the parent element
   */
  width?: number | string;
  /**
   * The height of the video element. Default is "100%".
   * Can be a number (in pixels) or a string (e.g. "100%").
   * If a number is provided, it will be converted to a string with "px" appended.
   * If a string is provided, it will be used as-is.
   * @example
   * height={500} // 500px
   * height="100%" // 100% of the parent element
   */
  height?: number | string;
  /**
   * The facing mode of the camera. Default is "environment".
   * Can be "user" for front camera or "environment" for back camera.
   */
  facingMode?: "environment" | "user";
  /**
   * Whether to turn on the flashlight. Default is false.
   */
  torch?: boolean;
  /**
   * Delay between scans in milliseconds. Default is 500ms.
   */
  delay?: number;
  /**
   * Video constraints to pass to the webcam. If not provided, the default constraints will be used.
   */
  videoConstraints?: MediaTrackConstraints;
  stopStream?: boolean;
  /**
   * Array of barcode formats to decode. If not provided, all formats will be used. A smaller list may improve the speed of the scan.
   *
   * @example
   * formats={["QR_CODE", "DATA_MATRIX"]}
   */
  formats?: BarcodeFormat[] | BarcodeStringFormat[];
}): React.ReactElement => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const codeReader = new BrowserMultiFormatReader(
      new Map([
        [
          DecodeHintType.POSSIBLE_FORMATS,
          formats?.map((f) => (typeof f === "string" ? BarcodeFormat[f] : f)),
        ],
      ])
    );
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
  }, [onUpdate, formats]);

  useEffect(() => {
    // Turn on the flashlight if prop is defined and device has the capability
    if (
      typeof torch === "boolean" &&
      (
        navigator?.mediaDevices?.getSupportedConstraints() as MediaTrackSupportedConstraints & {
          torch?: boolean;
        }
      ).torch
    ) {
      const stream = webcamRef?.current?.video?.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks()[0]; // get the active track of the stream
      if (track && track.getCapabilities().torch) {
        track
          .applyConstraints({
            advanced: [{ torch }] as unknown as MediaTrackConstraintSet[],
          })
          .catch((err: unknown) => onUpdate(err));
      }
    }
  }, [torch, onUpdate]);

  useEffect(() => {
    if (stopStream) {
      let stream = webcamRef?.current?.video?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => {
          stream?.removeTrack(track);
          track.stop();
        });
        stream = null;
      }
    }
  }, [stopStream]);

  useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, [capture, delay]);

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
      onUserMediaError={onError}
    />
  );
};

export default BarcodeScanner;
