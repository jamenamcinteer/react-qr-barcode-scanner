import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import BarcodeScanner from "../src/index";
import { BarcodeStringFormat } from "../src/BarcodeStringFormat";

// Mock the @zxing/library
vi.mock("@zxing/library", () => ({
  BrowserMultiFormatReader: vi.fn().mockImplementation(() => ({
    decodeFromImage: vi
      .fn()
      .mockResolvedValue({ getText: () => "test-result" }),
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

const baseProps = {
  onUpdate: vi.fn(),
  onError: vi.fn(),
};

describe("BarcodeScanner Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.mediaDevices
    Object.assign(window.navigator, {
      mediaDevices: {
        getSupportedConstraints: vi.fn().mockReturnValue({
          torch: true,
          facingMode: true,
          width: true,
          height: true,
        }),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("should handle all supported barcode formats", () => {
    const formats = [
      BarcodeStringFormat.QR_CODE,
      BarcodeStringFormat.CODE_128,
      BarcodeStringFormat.EAN_13,
      BarcodeStringFormat.DATA_MATRIX,
      BarcodeStringFormat.AZTEC,
      BarcodeStringFormat.PDF_417,
    ];

    formats.forEach((format) => {
      cleanup();
      render(<BarcodeScanner {...baseProps} formats={[format]} />);
      const video = screen.getByTestId("video");
      expect(video).toBeTruthy();
    });
  });

  test("should handle different camera facing modes", () => {
    const facingModes: Array<"environment" | "user"> = ["environment", "user"];

    facingModes.forEach((facingMode) => {
      cleanup();
      render(<BarcodeScanner {...baseProps} facingMode={facingMode} />);
      const video = screen.getByTestId("video");
      expect(video).toBeTruthy();
    });
  });

  test("should handle various size configurations", () => {
    const sizeConfigs = [
      { width: 640, height: 480 },
      { width: "100%", height: "100%" },
      { width: "50vw", height: "50vh" },
      { width: 1920, height: 1080 },
    ];

    sizeConfigs.forEach((config) => {
      cleanup();
      render(
        <BarcodeScanner
          {...baseProps}
          width={config.width}
          height={config.height}
        />
      );
      const video = screen.getByTestId("video");
      expect(video).toBeTruthy();
      expect(video.getAttribute("width")).toBe(String(config.width));
      expect(video.getAttribute("height")).toBe(String(config.height));
    });
  });

  test("should handle different delay intervals", () => {
    const delays = [100, 500, 1000, 2000];

    delays.forEach((delay) => {
      cleanup();
      render(<BarcodeScanner {...baseProps} delay={delay} />);
      const video = screen.getByTestId("video");
      expect(video).toBeTruthy();
    });
  });

  test("should handle custom video constraints", () => {
    const customConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
      facingMode: "environment" as const,
    };

    render(
      <BarcodeScanner {...baseProps} videoConstraints={customConstraints} />
    );
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle torch functionality", () => {
    render(<BarcodeScanner {...baseProps} torch={true} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    cleanup();

    render(<BarcodeScanner {...baseProps} torch={false} />);
    const video2 = screen.getByTestId("video");
    expect(video2).toBeTruthy();
  });

  test("should handle stream stopping", () => {
    render(<BarcodeScanner {...baseProps} stopStream={true} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    cleanup();

    render(<BarcodeScanner {...baseProps} stopStream={false} />);
    const video2 = screen.getByTestId("video");
    expect(video2).toBeTruthy();
  });

  test("should handle empty formats array", () => {
    render(<BarcodeScanner {...baseProps} formats={[]} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle undefined optional props", () => {
    render(<BarcodeScanner onUpdate={vi.fn()} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle prop updates", () => {
    const { rerender } = render(<BarcodeScanner {...baseProps} delay={500} />);
    let video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    // Update props
    rerender(<BarcodeScanner {...baseProps} delay={1000} />);
    video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle multiple format types simultaneously", () => {
    const mixedFormats = [
      BarcodeStringFormat.QR_CODE,
      BarcodeStringFormat.EAN_13,
      BarcodeStringFormat.CODE_128,
    ];

    render(<BarcodeScanner {...baseProps} formats={mixedFormats} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should maintain accessibility attributes", () => {
    render(<BarcodeScanner {...baseProps} />);
    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
    expect(video.getAttribute("data-testid")).toBe("video");
  });

  test("should handle edge case dimensions", () => {
    // Very small dimensions
    render(<BarcodeScanner {...baseProps} width={1} height={1} />);
    let video = screen.getByTestId("video");
    expect(video).toBeTruthy();

    cleanup();

    // Very large dimensions
    render(<BarcodeScanner {...baseProps} width={9999} height={9999} />);
    video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });

  test("should handle rapid prop changes", () => {
    const { rerender } = render(
      <BarcodeScanner {...baseProps} torch={false} />
    );

    // Rapidly change torch prop
    rerender(<BarcodeScanner {...baseProps} torch={true} />);
    rerender(<BarcodeScanner {...baseProps} torch={false} />);
    rerender(<BarcodeScanner {...baseProps} torch={true} />);

    const video = screen.getByTestId("video");
    expect(video).toBeTruthy();
  });
});
