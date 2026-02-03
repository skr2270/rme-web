declare module 'jsqr' {
  type JsQRResult = {
    data: string;
  } | null;

  function jsQR(data: Uint8ClampedArray, width: number, height: number): JsQRResult;

  export default jsQR;
}
