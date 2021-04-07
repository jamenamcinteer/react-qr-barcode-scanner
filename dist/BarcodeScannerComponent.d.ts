import React from "react";
import { Result } from "@zxing/library";
declare const BarcodeScannerComponent: ({ onUpdate, width, height, facingMode, delay, videoConstraints, }: {
    onUpdate: (arg0: unknown, arg1?: Result) => void;
    width?: number | string;
    height?: number | string;
    facingMode?: "environment" | "user";
    delay?: number;
    videoConstraints?: MediaTrackConstraints;
}) => React.ReactElement;
export default BarcodeScannerComponent;
