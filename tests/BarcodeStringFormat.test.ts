import { describe, expect, test } from "vitest";
import { BarcodeStringFormat } from "../src/BarcodeStringFormat";

describe("BarcodeStringFormat", () => {
  test("should have all expected format values", () => {
    expect(BarcodeStringFormat.AZTEC).toBe("AZTEC");
    expect(BarcodeStringFormat.CODABAR).toBe("CODABAR");
    expect(BarcodeStringFormat.CODE_39).toBe("CODE_39");
    expect(BarcodeStringFormat.CODE_93).toBe("CODE_93");
    expect(BarcodeStringFormat.CODE_128).toBe("CODE_128");
    expect(BarcodeStringFormat.DATA_MATRIX).toBe("DATA_MATRIX");
    expect(BarcodeStringFormat.EAN_8).toBe("EAN_8");
    expect(BarcodeStringFormat.EAN_13).toBe("EAN_13");
    expect(BarcodeStringFormat.ITF).toBe("ITF");
    expect(BarcodeStringFormat.MAXICODE).toBe("MAXICODE");
    expect(BarcodeStringFormat.PDF_417).toBe("PDF_417");
    expect(BarcodeStringFormat.QR_CODE).toBe("QR_CODE");
    expect(BarcodeStringFormat.RSS_14).toBe("RSS_14");
    expect(BarcodeStringFormat.RSS_EXPANDED).toBe("RSS_EXPANDED");
    expect(BarcodeStringFormat.UPC_A).toBe("UPC_A");
    expect(BarcodeStringFormat.UPC_E).toBe("UPC_E");
    expect(BarcodeStringFormat.UPC_EAN_EXTENSION).toBe("UPC_EAN_EXTENSION");
  });

  test("should contain exactly 17 format types", () => {
    const formatValues = Object.values(BarcodeStringFormat);
    expect(formatValues).toHaveLength(17);
  });

  test("should have all format keys matching their values", () => {
    const formatKeys = Object.keys(BarcodeStringFormat);
    const formatValues = Object.values(BarcodeStringFormat);

    formatKeys.forEach((key, index) => {
      expect(key).toBe(formatValues[index]);
    });
  });

  test("should be enumerable", () => {
    const formats = [];
    for (const format in BarcodeStringFormat) {
      formats.push(format);
    }
    expect(formats.length).toBeGreaterThan(0);
  });

  test("should support array creation from enum values", () => {
    const formatArray = [
      BarcodeStringFormat.QR_CODE,
      BarcodeStringFormat.CODE_128,
      BarcodeStringFormat.EAN_13,
    ];

    expect(formatArray).toContain("QR_CODE");
    expect(formatArray).toContain("CODE_128");
    expect(formatArray).toContain("EAN_13");
    expect(formatArray).toHaveLength(3);
  });

  test("should support filtering by format type", () => {
    const allFormats = Object.values(BarcodeStringFormat);

    // Filter 1D formats (those that typically end with numbers or are common 1D types)
    const oneDFormats = allFormats.filter(
      (format) =>
        format.includes("CODE_") ||
        format.includes("EAN_") ||
        format.includes("UPC_") ||
        format === "CODABAR" ||
        format === "ITF" ||
        format.includes("RSS_")
    );

    expect(oneDFormats).toContain("CODE_39");
    expect(oneDFormats).toContain("CODE_128");
    expect(oneDFormats).toContain("EAN_8");
    expect(oneDFormats).toContain("EAN_13");
    expect(oneDFormats).toContain("UPC_A");
    expect(oneDFormats).toContain("UPC_E");

    // Filter 2D formats
    const twoDFormats = allFormats.filter(
      (format) =>
        format === "QR_CODE" ||
        format === "DATA_MATRIX" ||
        format === "PDF_417" ||
        format === "AZTEC" ||
        format === "MAXICODE"
    );

    expect(twoDFormats).toContain("QR_CODE");
    expect(twoDFormats).toContain("DATA_MATRIX");
    expect(twoDFormats).toContain("PDF_417");
  });
});
