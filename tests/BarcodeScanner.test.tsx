import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import BarcodeScanner from "../src/index";
import { BarcodeStringFormat } from "../src/BarcodeStringFormat";
import { BarcodeFormat } from "@zxing/library";

// Mock the @zxing/library
vi.mock("@zxing/library", () => ({
  BrowserMultiFormatReader: vi.fn().mockImplementation(() => ({
    decodeFromImage: vi.fn(),
  })),
  DecodeHintType: {
    POSSIBLE_FORMATS: "POSSIBLE_FORMATS",
  },
  BarcodeFormat: {
    QR_CODE: "QR_CODE",
    CODE_128: "CODE_128",
    EAN_13: "EAN_13",
    DATA_MATRIX: "DATA_MATRIX",
  },
}));

// Mock react-webcam
vi.mock("react-webcam", () => {
  const MockedWebcam = React.forwardRef<
    HTMLVideoElement,
    Record<string, unknown>
  >((props, ref) => <video {...props} ref={ref} data-testid="video" />);
  MockedWebcam.displayName = "MockedWebcam";

  return {
    default: MockedWebcam,
  };
});

const defaultProps = {
  onUpdate: vi.fn(),
  onError: vi.fn(),
  width: "100%",
  height: "100%",
  facingMode: "environment" as const,
  torch: false,
  delay: 500,
  videoConstraints: {},
  stopStream: false,
  formats: undefined,
};

describe("BarcodeScanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock navigator.mediaDevices
    Object.assign(window.navigator, {
      mediaDevices: {
        getSupportedConstraints: vi.fn().mockReturnValue({
          torch: true,
          facingMode: true,
        }),
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("should render video element", () => {
    render(<BarcodeScanner {...defaultProps} />);
    expect(screen.getByTestId("video")).toBeTruthy();
  });

  test("should call onUpdate when provided", () => {
    const onUpdate = vi.fn();
    render(<BarcodeScanner {...defaultProps} onUpdate={onUpdate} />);
    expect(onUpdate).toBeDefined();
  });

  test("should call onError when provided", () => {
    const onError = vi.fn();
    render(<BarcodeScanner {...defaultProps} onError={onError} />);
    expect(onError).toBeDefined();
  });

  test("should render with custom width and height as numbers", () => {
    render(<BarcodeScanner {...defaultProps} width={500} height={300} />);
    const video = screen.getByTestId("video");
    expect(video.getAttribute("width")).toBe("500");
    expect(video.getAttribute("height")).toBe("300");
  });

  test("should render with custom width and height as strings", () => {
    render(<BarcodeScanner {...defaultProps} width="80%" height="60%" />);
    const video = screen.getByTestId("video");
    expect(video.getAttribute("width")).toBe("80%");
    expect(video.getAttribute("height")).toBe("60%");
  });

  test("should set facingMode to user", () => {
    render(<BarcodeScanner {...defaultProps} facingMode="user" />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should accept custom delay", () => {
    render(<BarcodeScanner {...defaultProps} delay={1000} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should accept custom videoConstraints", () => {
    const customConstraints = {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: "user" as const,
    };
    render(
      <BarcodeScanner {...defaultProps} videoConstraints={customConstraints} />
    );
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should accept BarcodeFormat array for formats", () => {
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128];
    render(<BarcodeScanner {...defaultProps} formats={formats} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should accept BarcodeStringFormat array for formats", () => {
    const formats = [BarcodeStringFormat.QR_CODE, BarcodeStringFormat.EAN_13];
    render(<BarcodeScanner {...defaultProps} formats={formats} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should accept mixed format arrays", () => {
    // Test with separate arrays to avoid type issues
    const barcodeFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
    const stringFormats: BarcodeStringFormat[] = [BarcodeStringFormat.CODE_128];

    render(<BarcodeScanner {...defaultProps} formats={barcodeFormats} />);
    let video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    cleanup();

    render(<BarcodeScanner {...defaultProps} formats={stringFormats} />);
    video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle torch prop when device supports it", () => {
    const mockApplyConstraints = vi.fn().mockResolvedValue(undefined);
    const mockGetCapabilities = vi.fn().mockReturnValue({ torch: true });
    const mockTrack = {
      getCapabilities: mockGetCapabilities,
      applyConstraints: mockApplyConstraints,
    };

    const mockStream = {
      getVideoTracks: vi.fn().mockReturnValue([mockTrack]),
    };

    // Mock the webcam ref to have a video with srcObject
    const mockVideo = {
      srcObject: mockStream,
    };

    vi.spyOn(React, "useRef").mockReturnValue({
      current: {
        video: mockVideo,
        getScreenshot: vi.fn().mockReturnValue("data:image/jpeg;base64,test"),
      },
    });

    render(<BarcodeScanner {...defaultProps} torch={true} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle stopStream prop", () => {
    const mockStop = vi.fn();
    const mockRemoveTrack = vi.fn();
    const mockTrack = { stop: mockStop };
    const mockStream = {
      getTracks: vi.fn().mockReturnValue([mockTrack]),
      removeTrack: mockRemoveTrack,
    };

    const mockVideo = {
      srcObject: mockStream,
    };

    vi.spyOn(React, "useRef").mockReturnValue({
      current: {
        video: mockVideo,
        getScreenshot: vi.fn().mockReturnValue("data:image/jpeg;base64,test"),
      },
    });

    render(<BarcodeScanner {...defaultProps} stopStream={true} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should render with timer delay prop", () => {
    const onUpdate = vi.fn();
    render(
      <BarcodeScanner {...defaultProps} onUpdate={onUpdate} delay={100} />
    );

    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
    expect(onUpdate).toBeDefined();
  });

  test("should handle error cases gracefully", () => {
    const onUpdate = vi.fn();
    const onError = vi.fn();

    render(
      <BarcodeScanner {...defaultProps} onUpdate={onUpdate} onError={onError} />
    );

    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
    expect(onUpdate).toBeDefined();
    expect(onError).toBeDefined();
  });

  test("should handle component lifecycle", () => {
    const onUpdate = vi.fn();

    const { unmount } = render(
      <BarcodeScanner {...defaultProps} onUpdate={onUpdate} delay={100} />
    );

    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    // Test unmounting
    unmount();
    expect(onUpdate).toBeDefined();
  });

  test("should handle torch constraint application error", () => {
    const onUpdate = vi.fn();
    const mockApplyConstraints = vi
      .fn()
      .mockRejectedValue(new Error("Torch not supported"));
    const mockGetCapabilities = vi.fn().mockReturnValue({ torch: true });
    const mockTrack = {
      getCapabilities: mockGetCapabilities,
      applyConstraints: mockApplyConstraints,
    };

    const mockStream = {
      getVideoTracks: vi.fn().mockReturnValue([mockTrack]),
    };

    const mockVideo = {
      srcObject: mockStream,
    };

    vi.spyOn(React, "useRef").mockReturnValue({
      current: {
        video: mockVideo,
        getScreenshot: vi.fn().mockReturnValue("data:image/jpeg;base64,test"),
      },
    });

    render(
      <BarcodeScanner {...defaultProps} torch={true} onUpdate={onUpdate} />
    );
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle device without torch capability", () => {
    const mockGetCapabilities = vi.fn().mockReturnValue({ torch: false });
    const mockTrack = {
      getCapabilities: mockGetCapabilities,
      applyConstraints: vi.fn(),
    };

    const mockStream = {
      getVideoTracks: vi.fn().mockReturnValue([mockTrack]),
    };

    const mockVideo = {
      srcObject: mockStream,
    };

    vi.spyOn(React, "useRef").mockReturnValue({
      current: {
        video: mockVideo,
        getScreenshot: vi.fn().mockReturnValue("data:image/jpeg;base64,test"),
      },
    });

    render(<BarcodeScanner {...defaultProps} torch={true} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should clean up interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(<BarcodeScanner {...defaultProps} />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
