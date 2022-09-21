import React from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import Webcam from 'react-webcam';

interface CustomMediaTrackSupportedConstraints extends MediaTrackSupportedConstraints {
  torch: boolean
}

type Prop = {
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  onError?: (arg0: string | DOMException) => void;
  width?: number | string;
  height?: number | string;
  facingMode?: 'environment' | 'user';
  torch?: boolean;
  delay?: number;
  videoConstraints?: MediaTrackConstraints;
  stopStream?: boolean;
}

const BarcodeScannerComponent: React.FC<Prop> = ({
  onUpdate,
  onError,
  width = '100%',
  height = '100%',
  facingMode = 'environment',
  torch,
  delay = 500,
  videoConstraints,
  stopStream,
}) => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
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
  }, [onUpdate]);

  React.useEffect(() => {
    // Turn on the flashlight if prop is defined and device has the capability
    if (
      typeof torch === 'boolean' &&
        (navigator?.mediaDevices?.getSupportedConstraints() as CustomMediaTrackSupportedConstraints).torch
    ) {
      const stream = webcamRef?.current?.video.srcObject;
      const track = stream?.getVideoTracks()[0]; // get the active track of the stream
      if (
        track &&
        track.getCapabilities().torch &&
        !track.getConstraints().torch
      ) {
        track
          .applyConstraints({
            advanced: [{ torch }],
          })
          .catch((err: Error) => onUpdate(err));
      }
    }
  }, [torch, onUpdate]);

  React.useEffect(() => {
    if (stopStream) {
      let stream: MediaStream | null = webcamRef?.current?.video.srcObject;

      if (stream) {
        stream.getTracks().forEach((track) => {
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
      onUserMediaError={onError}
    />
  );
};
BarcodeScannerComponent.displayName = 'BarcodeScannerComponent';

export default BarcodeScannerComponent;
