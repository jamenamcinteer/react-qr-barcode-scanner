import { useState } from "react";
import "./App.css";
import BarcodeScanner, { BarcodeStringFormat } from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState<string>("");
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const [formats, setFormats] = useState<BarcodeStringFormat[] | undefined>(
    undefined
  );

  return (
    <>
      <fieldset style={{ width: "300px", margin: "16px auto" }}>
        <label style={{ marginRight: "16px" }}>Torch:</label>
        <button onClick={() => setTorchEnabled((prev) => !prev)}>
          Torch (Flashlight): {torchEnabled ? "On" : "Off"}
        </button>
      </fieldset>
      <fieldset style={{ width: "300px", margin: "16px auto" }}>
        <label style={{ marginRight: "16px" }}>Facing Mode:</label>
        <select
          onChange={(event) =>
            setFacingMode(event.target.value as "environment" | "user")
          }
        >
          <option value="environment">environment</option>
          <option value="user">user</option>
        </select>
      </fieldset>
      <fieldset style={{ width: "300px", margin: "16px auto" }}>
        <label style={{ marginRight: "16px" }}>Format:</label>
        <select
          onChange={(event) =>
            setFormats([event.target.value as BarcodeStringFormat])
          }
        >
          <option value={undefined}>ALL</option>
          <option value={BarcodeStringFormat.AZTEC}>AZTEC</option>
          <option value={BarcodeStringFormat.CODABAR}>CODABAR</option>
          <option value={BarcodeStringFormat.CODE_128}>CODE_128</option>
          <option value={BarcodeStringFormat.CODE_39}>CODE_39</option>
          <option value={BarcodeStringFormat.CODE_93}>CODE_93</option>
          <option value={BarcodeStringFormat.DATA_MATRIX}>DATA_MATRIX</option>
          <option value={BarcodeStringFormat.EAN_13}>EAN_13</option>
          <option value={BarcodeStringFormat.EAN_8}>EAN_8</option>
          <option value={BarcodeStringFormat.ITF}>ITF</option>
          <option value={BarcodeStringFormat.MAXICODE}>MAXICODE</option>
          <option value={BarcodeStringFormat.PDF_417}>PDF_417</option>
          <option value={BarcodeStringFormat.QR_CODE}>QR_CODE</option>
          <option value={BarcodeStringFormat.RSS_14}>RSS_14</option>
          <option value={BarcodeStringFormat.RSS_EXPANDED}>RSS_EXPANDED</option>
          <option value={BarcodeStringFormat.UPC_A}>UPC_A</option>
          <option value={BarcodeStringFormat.UPC_E}>UPC_E</option>
          <option value={BarcodeStringFormat.UPC_EAN_EXTENSION}>
            UPC_EAN_EXTENSION
          </option>
        </select>
      </fieldset>
      <BarcodeScanner
        width="100%"
        height={500}
        onUpdate={(_err, result) => {
          if (result) setData(result.getText());
        }}
        torch={torchEnabled}
        facingMode={facingMode}
        formats={formats}
      />
      <p>Result: {data}</p>
    </>
  );
}

export default App;
