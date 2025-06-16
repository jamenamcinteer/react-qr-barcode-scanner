# React QR Barcode Scanner

This is a simple React component built in Typescript to provide a webcam-based barcode scanner using [react-webcam](https://github.com/mozmorris/react-webcam) and [@zxing/library](https://github.com/zxing-js/library). This component works on Computers and Mobile Devices (iOS 11 and above and Android Phones).

Thanks to the initial repo: https://github.com/dashboardphilippines/react-webcam-barcode-scanner

## Installation

```
npm i react-qr-barcode-scanner
```

## Demo
Try a demo of the scanner [here](https://jamenamcinteer.github.io/react-qr-barcode-scanner/).

![QR Code for demo link](https://raw.githubusercontent.com/jamenamcinteer/react-qr-barcode-scanner/refs/heads/next-release/docs/assets/demo-qr.png)

## Usage in React:

```jsx
import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState("Not Found");

  return (
    <>
      <BarcodeScanner
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

## Usage in NextJS:

```jsx
import dynamic from "next/dynamic"

const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
)

// ... same as before
```

## Props

### onUpdate

Type: `function`, Required, Argument: `error`, `result`

Function that returns the result for every captured frame. Text from barcode can be accessed from `result.getText()` if there is a result.

### onError

Type: `function`, Optional, Argument: `error`

If passed to the component, this function is called when there is an error with the camera (rather than with with reading the QR code, which would be passed to `onUpdate`). An example would be an error thrown when the user does not allow the required camera permission. This can be handled with an `onError` function similar to this:

```jsx
const onError = (error) => {
  if (error.name === "NotAllowedError") {
    // Handle messaging in our app after the user chooses to not allow the camera permissions
  }
};
```

### width

Type: `number` or `string`, Optional, Default: `100%`

### height

Type: `number` or `string`, Optional, Default: `100%`

### facingMode

Type: `environment` or `user`, Optional, Default: `environment`

`user` is the user-facing (front) camera, and `environment` is the rear camera.

### torch

Type: `boolean`, Optional

Turn the camera flashlight on or off.

Torch will only work if the correct `facingMode` is selected. For example, if "user" is selected but the flashlight corresponds to the "environment" camera, then it will not turn on.

Torch will not turn on if a static value of `true` is passed. The initial value must be `false`, and then switched to `true` after a timeout or after a user action.

Here is an example using a timeout:
```
const [torchEnabled, setTorchEnabled] = useState<boolean>(false);

useEffect(() => {
    setTimeout(() => {
      setTorchEnabled(true);
    }, 2000);
  }, []);

<BarcodeScanner
  torch={torchEnabled}
  onUpdate={(err, result) => {}}
/>
```

### delay

Type: `number`, Optional, Default: `500`

### videoConstraints

Type: `MediaTrackConstraints`, Optional

### stopStream

Type: `boolean`, Optional

This prop is a workaround for a bug where the browser freezes if the webcam component is unmounted or removed. See known issues for more about this issue.

### formats

Type: `BarcodeFormat[] | BarcodeStringFormat[]`, Optional

Array of barcode formats to decode. If not provided, all formats will be used. A smaller list may improve the speed of the scan.

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
- Browser compatibility is limited by react-webcam's usage of the Stream API: https://caniuse.com/stream. On iOS-Devices with iOS < 14.3 camera access works only in native Safari and not in other Browsers (Chrome, etc) or Apps that use an UIWebView or WKWebView. iOS 14.3 (released in December 2020) now supports WebRTC in 3rd party browsers as well.
- There is a bug in the `react-webcam` package that causes the browser to freeze when the component is unmounted or removed, or the camera video constraints are changed (for example, switching cameras or navigating away from the screen with the camera component). Please see this thread regarding the reported issue: https://github.com/mozmorris/react-webcam/issues/244. As a workaround, `react-qr-barcode-scanner` allows passing a `stopStream` prop to stop the video streams when `true` is passed, allowing you to close the stream before unmounting the component or doing some other action that may cause the freeze. I found I needed to set a timeout to wait one tick before dismissing the modal in my use case to prevent the freeze. **PRs to improve this issue are welcome!**

  Example:

  ```jsx
  const [stopStream, setStopStream] = useState(false)
  //...
  const dismissQrReader = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(true)
    setTimeout(() => closeModal(), 0)
  }
  //...
  <Modal>
    <BarcodeScanner onUpdate={onUpdate} stopStream={stopStream} />
    <button onClick={dismissQrReader}>
  </Modal>
  ```

## Contributing
We welcome contributions to react-qr-barcode-scanner.

If you have an idea for a new feature or have discovered a bug, please open an issue.

Please `yarn build` in the root and `docs_src` directories before pushing changes.

Don't forget to add a title and a description explaining the issue you're trying to solve and your proposed solution.