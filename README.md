# React Webcam Barcode Scanner

This is a simple barebones React component built in Typescript to provide a webcam-based barcode scanner using [react-webcam](https://github.com/mozmorris/react-webcam) and [@zxing/library](https://github.com/zxing-js/library). This component works on Computers and Mobile Devices (iOS 11 and above and Android Phones).

## Installation

```
npm i react-webcam-barcode-scanner
```

## Usage in React:

A demo of this can be found at: [https://barcode.phdash.com](https://barcode.phdash.com).

```jsx
import React from 'react';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

function App() {

  const [ data, setData ] = React.useState('Not Found');

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text)
          else setData('Not Found')
        }}
      />
      <p>{data}</p>
    </>
  )
}

export default App;
```
