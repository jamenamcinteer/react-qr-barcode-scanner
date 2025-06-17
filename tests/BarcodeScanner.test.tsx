import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import BarcodeScanner from "../src/index";

const props = {
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
  Object.assign(window.navigator, {
    mediaDevices: {
      getSupportedConstraints: vi
        .fn()
        .mockImplementation(() => Promise.resolve()),
    },
  });

  test("should render video", () => {
    render(<BarcodeScanner {...props} />);
    expect(screen.getByTestId("video")).toBeTruthy();
  });
});
