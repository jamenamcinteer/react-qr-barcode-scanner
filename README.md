# React Webcam Barcode Scanner

This is a simple React component built in Typescript to provide a webcam-based barcode scanner using [react-webcam](https://github.com/mozmorris/react-webcam) and [@zxing/library](https://github.com/zxing-js/library). This component works on Computers and Mobile Devices (iOS 11 and above and Android Phones).

Thanks to the initial repo: https://github.com/dashboardphilippines/react-webcam-barcode-scanner

## Installation

```
npm i react-qr-barcode-scanner
```

## Usage in React:

```jsx
import React from "react";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

function App() {
  const [data, setData] = React.useState("Not Found");

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
          else setData("Not Found");
        }}
      />
      <p>{data}</p>
    </>
  );
}

export default App;
```

## Props

### onUpdate

Type: `function`, Required, Argument: `error`, `result`

### width

Type: `number` or `string`, Optional, Default: `100%`

### height

Type: `number` or `string`, Optional, Default: `100%`

### facingMode

Type: `environment` or `user`, Optional, Default: `environment`

### delay

Type: `number`, Optional, Default: `500`

### videoConstraints

Type: `MediaTrackConstraints`, Optional

## Supported Barcode Formats

These formats are supported by ZXing:

| 1D product | 1D industrial | 2D          |
| ---------- | ------------- | ----------- |
| UPC-A      | Code 39       | QR Code     |
| UPC-E      | Code 128      | Data Matrix |
| EAN-8      | ITF           | Aztec       |
| EAN-13     | RSS-14        | PDF 417     |

## Known Issues

- The camera can only be accessed over https or localhost
- Browser compatibility is limited by react-webcam's usage of the Stream API: https://caniuse.com/stream
- On iOS-Devices with iOS < 14.3 camera access works only in native Safari and not in other Browsers (Chrome,...) or Apps that use an UIWebView or WKWebView. iOS 14.3 (released in december 2020) now supports WebRTC in 3rd party browsers as well.
