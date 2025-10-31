import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import BarcodeScanner from "../src/index";
import { BarcodeStringFormat } from "../src/BarcodeStringFormat";

// Mock the @zxing/library
vi.mock("@zxing/library", () => ({
  BrowserMultiFormatReader: vi.fn(),
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

describe("BarcodeScanner Error Handling & Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.mediaDevices
    Object.assign(window.navigator, {
      mediaDevices: {
        getSupportedConstraints: vi.fn().mockReturnValue({
          torch: false, // Simulate device without torch
          facingMode: true,
        }),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("should handle missing navigator.mediaDevices", () => {
    // Remove mediaDevices
    Object.assign(window.navigator, {
      mediaDevices: undefined,
    });

    const onUpdate = vi.fn();
    const onError = vi.fn();

    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} onError={onError} />);
    }).not.toThrow();
  });

  test("should handle device without torch capability", () => {
    Object.assign(window.navigator, {
      mediaDevices: {
        getSupportedConstraints: vi.fn().mockReturnValue({
          torch: false, // No torch support
          facingMode: true,
        }),
      },
    });

    const onUpdate = vi.fn();

    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} torch={true} />);
    }).not.toThrow();
  });

  test("should handle null/undefined callbacks gracefully", () => {
    expect(() => {
      render(<BarcodeScanner onUpdate={vi.fn()} onError={undefined} />);
    }).not.toThrow();
  });

  test("should handle invalid format arrays", () => {
    const onUpdate = vi.fn();

    // Test with empty array
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} formats={[]} />);
    }).not.toThrow();

    cleanup();

    // Test with undefined
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} formats={undefined} />);
    }).not.toThrow();
  });

  test("should handle extreme delay values", () => {
    const onUpdate = vi.fn();

    // Very small delay
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} delay={1} />);
    }).not.toThrow();

    cleanup();

    // Very large delay
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} delay={999999} />);
    }).not.toThrow();

    cleanup();

    // Zero delay
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} delay={0} />);
    }).not.toThrow();
  });

  test("should handle invalid dimensions", () => {
    const onUpdate = vi.fn();

    // Negative dimensions
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} width={-100} height={-100} />);
    }).not.toThrow();

    cleanup();

    // Zero dimensions
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} width={0} height={0} />);
    }).not.toThrow();
  });

  test("should handle empty video constraints", () => {
    const onUpdate = vi.fn();

    const emptyConstraints = {};

    expect(() => {
      render(
        <BarcodeScanner
          onUpdate={onUpdate}
          videoConstraints={emptyConstraints}
        />
      );
    }).not.toThrow();
  });

  test("should handle rapid component mounting/unmounting", () => {
    const onUpdate = vi.fn();

    // Mount and unmount rapidly
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<BarcodeScanner onUpdate={onUpdate} />);
      unmount();
    }

    // Should not throw errors
    expect(onUpdate).toBeDefined();
  });

  test("should handle all barcode string formats", () => {
    const onUpdate = vi.fn();

    // Test with all available formats
    const allFormats = Object.values(BarcodeStringFormat);

    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} formats={allFormats} />);
    }).not.toThrow();
  });

  test("should handle different format array combinations", () => {
    const onUpdate = vi.fn();

    // Test with single format
    const singleFormat = [BarcodeStringFormat.QR_CODE];
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} formats={singleFormat} />);
    }).not.toThrow();

    cleanup();

    // Test with multiple formats
    const multipleFormats = [
      BarcodeStringFormat.QR_CODE,
      BarcodeStringFormat.CODE_128,
    ];
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} formats={multipleFormats} />);
    }).not.toThrow();
  });

  test("should handle component with no props except onUpdate", () => {
    const onUpdate = vi.fn();

    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} />);
    }).not.toThrow();
  });

  test("should handle boolean torch values correctly", () => {
    const onUpdate = vi.fn();

    // Test explicit true
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} torch={true} />);
    }).not.toThrow();

    cleanup();

    // Test explicit false
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} torch={false} />);
    }).not.toThrow();

    cleanup();

    // Test undefined (should default to false)
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} torch={undefined} />);
    }).not.toThrow();
  });

  test("should handle stopStream flag correctly", () => {
    const onUpdate = vi.fn();

    // Test with stopStream true
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} stopStream={true} />);
    }).not.toThrow();

    cleanup();

    // Test with stopStream false
    expect(() => {
      render(<BarcodeScanner onUpdate={onUpdate} stopStream={false} />);
    }).not.toThrow();
  });

  test("should handle string and number dimensions interchangeably", () => {
    const onUpdate = vi.fn();

    const dimensionTests = [
      { width: "100px", height: "200px" },
      { width: 300, height: 400 },
      { width: "50%", height: "75%" },
      { width: "100vw", height: "100vh" },
    ];

    dimensionTests.forEach((dims) => {
      cleanup();
      expect(() => {
        render(
          <BarcodeScanner
            onUpdate={onUpdate}
            width={dims.width}
            height={dims.height}
          />
        );
      }).not.toThrow();
    });
  });

  test("should handle component state without crashing", () => {
    const onUpdate = vi.fn();
    const onError = vi.fn();

    // Render component and verify it initializes without errors
    const { unmount } = render(
      <BarcodeScanner
        onUpdate={onUpdate}
        onError={onError}
        delay={500}
        torch={false}
        stopStream={false}
        formats={[BarcodeStringFormat.QR_CODE]}
      />
    );

    // Component should render without throwing
    expect(onUpdate).toBeDefined();
    expect(onError).toBeDefined();

    // Should unmount cleanly
    expect(() => unmount()).not.toThrow();
  });
});
