import { useState } from "react";
import "./App.css";
import BarcodeScanner from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState<string>("Not Found");
  const [error, setError] = useState<string>(null);

  return (
    <>
      <BarcodeScanner
        width={500}
        height={500}
        onUpdate={(err, result) => {
          console.log("result", result);
          if (result) setData(result.text);
          else setData("Not Found");
        }}
        onError={(error) => {
          setError(error as string);
        }}
      />
      <p>{error}</p>
      <p>{data}</p>
    </>
  );
}

export default App;
