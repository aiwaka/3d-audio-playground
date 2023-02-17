// 畳み込みアプリでHRTFの角度を指定するためのフォームやcanvas要素を操作する

// 指定したidのcanvasを取得
const getCanvasRenderingContext2D = (
  id: string
): CanvasRenderingContext2D | null => {
  const canvas = document.querySelector<HTMLCanvasElement>(`#${id}`);
  if (canvas !== null) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      return ctx;
    }
  }
  return null;
};

window.addEventListener("load", () => {
  const elevCtx = getCanvasRenderingContext2D("elev-canvas");
  if (elevCtx !== null) {
    elevCtx.beginPath();
    elevCtx.moveTo(0, 0);
    elevCtx.lineTo(100, 100);
    elevCtx.stroke();
  }
});

export {};
