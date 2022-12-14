"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const library_1 = require("@zxing/library");
const react_webcam_1 = __importDefault(require("react-webcam"));
const BarcodeScannerComponent = ({ onUpdate, onError, width = "100%", height = "100%", facingMode = "environment", torch, delay = 500, videoConstraints, stopStream, }) => {
    const webcamRef = react_1.default.useRef(null);
    const capture = react_1.default.useCallback(() => {
        var _a;
        const codeReader = new library_1.BrowserMultiFormatReader();
        const imageSrc = (_a = webcamRef === null || webcamRef === void 0 ? void 0 : webcamRef.current) === null || _a === void 0 ? void 0 : _a.getScreenshot();
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
    react_1.default.useEffect(() => {
        var _a, _b;
        // Turn on the flashlight if prop is defined and device has the capability
        if (typeof torch === "boolean" && ((_a = 
        // @ts-ignore
        navigator === null || 
        // @ts-ignore
        navigator === void 0 ? void 0 : 
        // @ts-ignore
        navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getSupportedConstraints().torch)) {
            const stream = (_b = webcamRef === null || webcamRef === void 0 ? void 0 : webcamRef.current) === null || _b === void 0 ? void 0 : _b.video.srcObject;
            const track = stream === null || stream === void 0 ? void 0 : stream.getVideoTracks()[0]; // get the active track of the stream
            if (track &&
                track.getCapabilities().torch &&
                !track.getConstraints().torch) {
                track
                    .applyConstraints({
                    advanced: [{ torch }],
                })
                    .catch((err) => onUpdate(err));
            }
        }
    }, [torch, onUpdate]);
    react_1.default.useEffect(() => {
        var _a;
        if (stopStream) {
            let stream = (_a = webcamRef === null || webcamRef === void 0 ? void 0 : webcamRef.current) === null || _a === void 0 ? void 0 : _a.video.srcObject;
            if (stream) {
                stream.getTracks().forEach((track) => {
                    stream.removeTrack(track);
                    track.stop();
                });
                stream = null;
            }
        }
    }, [stopStream]);
    react_1.default.useEffect(() => {
        const interval = setInterval(capture, delay);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (react_1.default.createElement(react_webcam_1.default, { width: width, height: height, ref: webcamRef, screenshotFormat: "image/jpeg", videoConstraints: videoConstraints || {
            facingMode,
        }, audio: false, onUserMediaError: onError }));
};
exports.default = BarcodeScannerComponent;
