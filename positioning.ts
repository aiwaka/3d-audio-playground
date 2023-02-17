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
  // 顔っぽい線を描く
  const elevCtx = getCanvasRenderingContext2D("elev-canvas");
  if (elevCtx !== null) {
    elevCtx.beginPath();
    elevCtx.moveTo(50, 0);
    elevCtx.bezierCurveTo(40, 0, 20, 20, 20, 40);
    elevCtx.lineTo(10, 60);
    elevCtx.lineTo(18, 65);
    elevCtx.lineTo(25, 80);
    elevCtx.bezierCurveTo(30, 90, 30, 90, 50, 85);
    elevCtx.moveTo(40, 40);
    elevCtx.arc(
      50,
      50,
      Math.sqrt(200),
      (Math.PI / 180) * -135,
      (Math.PI / 180) * 135
    );
    elevCtx.stroke();
  }
});

export {};
