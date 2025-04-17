/**
 * Enumerates barcode formats known to this package as strings. These need to be the same as BarcodeFormat from "@zing/library".
 */
export enum BarcodeStringFormat {
  /** Aztec 2D barcode format. */
  AZTEC = "AZTEC",
  /** CODABAR 1D format. */
  CODABAR = "CODABAR",
  /** Code 39 1D format. */
  CODE_39 = "CODE_39",
  /** Code 93 1D format. */
  CODE_93 = "CODE_93",
  /** Code 128 1D format. */
  CODE_128 = "CODE_128",
  /** Data Matrix 2D barcode format. */
  DATA_MATRIX = "DATA_MATRIX",
  /** EAN-8 1D format. */
  EAN_8 = "EAN_8",
  /** EAN-13 1D format. */
  EAN_13 = "EAN_13",
  /** ITF (Interleaved Two of Five) 1D format. */
  ITF = "ITF",
  /** MaxiCode 2D barcode format. */
  MAXICODE = "MAXICODE",
  /** PDF417 format. */
  PDF_417 = "PDF_417",
  /** QR Code 2D barcode format. */
  QR_CODE = "QR_CODE",
  /** RSS 14 */
  RSS_14 = "RSS_14",
  /** RSS EXPANDED */
  RSS_EXPANDED = "RSS_EXPANDED",
  /** UPC-A 1D format. */
  UPC_A = "UPC_A",
  /** UPC-E 1D format. */
  UPC_E = "UPC_E",
  /** UPC/EAN extension format. Not a stand-alone format. */
  UPC_EAN_EXTENSION = "UPC_EAN_EXTENSION",
}
export default BarcodeStringFormat;
