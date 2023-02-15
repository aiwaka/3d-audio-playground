const readHrtf = async (path: string): Promise<number[]> => {
  const response = await fetch(path);
  //  バイナリをarrayBuffer形式で保持
  const hrtfBuffer = await response.arrayBuffer();
  // バイナリを読み出すためのビューを作成
  const hrtfView = new DataView(hrtfBuffer);
  const result: number[] = [];
  for (let i = 0; i < 1024; i += 2) {
    // ビッグエンディアンを明示し, 符号付き16bit整数としてバイナリを読み出してリストに保存する.
    result.push(hrtfView.getInt16(i, false));
  }
  return result;
};

// [-2^{15}, 2^{15}-1]の数値を[0, 511]に変換する.
// canvasは左上が原点なので, 左下が原点に見える修正もする（単に符号を反転させるだけ）.
const numToY = (num: number): number => {
  return ((-num + 32768.0) / 65536.0) * 511.0;
};

// canvas要素の描画コンテクストを取得する操作
const getCanvasRenderingContext2D = (): CanvasRenderingContext2D | null => {
  const canvas = document.querySelector("canvas");
  if (canvas !== null) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      return ctx;
    }
  }
  return null;
};

const LINE_COLOR_LIST = ["blue", "orange", "green", "magenta", "gray"];
// 描いた線の数を保存する
let lineNum = 0;
const drawGraph = (data: number[]) => {
  const ctx = getCanvasRenderingContext2D();
  if (ctx !== null) {
    ctx.beginPath();
    ctx.moveTo(0, numToY(0));
    for (let i = 0; i < 512; i++) {
      ctx.lineTo(i, numToY(data[i]));
    }
    ctx.strokeStyle = LINE_COLOR_LIST[lineNum % LINE_COLOR_LIST.length];
    lineNum += 1;
    ctx.stroke();
  }
};
const clearGraph = () => {
  // canvasも必要なのでここではコンテクスト取得メソッドは使わない
  const canvas = document.querySelector("canvas");
  if (canvas !== null) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lineNum = 0;
    }
  }
};

// フォームの値からHRTFデータのファイル名を作成する.
const makeFilepath = (): string => {
  const lrForm = document.querySelector("#lr") as HTMLSelectElement;
  const elevForm = document.querySelector("#elev") as HTMLInputElement;
  const aziForm = document.querySelector("#azi") as HTMLInputElement;
  const lr = lrForm.value === "left" ? "L" : "R";
  const elev = elevForm.value;
  const aziValue = aziForm.value;
  // 右のhrtfは左のものを対称に考えたものを使う.
  // 刻みが整数でない方位角に対してもうまくいくのでok.
  const azi =
    lr === "L" ? aziValue : ((360 - parseInt(aziValue)) % 360).toString();
  // NOTE: padStartはES1027準拠らしいのでtsconfig.jsonのtargetをesnextに変更した.
  const paddedAzi = azi.padStart(3, "0");
  const path = `./audio/full/elev${elev}/L${elev}e${paddedAzi}a.dat`;
  return path;
};
// filepath-displayを書き換える
const changeFilepathDisplay = (path: string) => {
  const span = document.querySelector("#filepath-display") as HTMLElement;
  span.innerText = path;
};

document.querySelector("#load-hrtf")?.addEventListener("click", async () => {
  const path = makeFilepath();
  changeFilepathDisplay(path);
  // readHrtf("./audio/full/elev0/L0e000a.dat")
  readHrtf(path)
    .then((array) => {
      drawGraph(array);
    })
    .catch((error) => {
      console.log(error);
    });
});

document
  .querySelector("#clear-canvas")
  ?.addEventListener("click", () => clearGraph());
