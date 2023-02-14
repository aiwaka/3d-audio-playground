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

// [-2^{15}, 2^{15}-1]の数値を[0, 511]に変換する
const numToY = (num: number): number => {
  return ((num + 32768.0) / 65536.0) * 511.0;
};

const drawGraph = (data: number[]) => {
  const canvas = document.querySelector("canvas");
  if (canvas !== null) {
    const ctx = canvas.getContext("2d");
    if (ctx !== null) {
      ctx.beginPath();
      ctx.moveTo(0, numToY(0));
      for (let i = 0; i < 512; i++) {
        ctx.lineTo(i, numToY(data[i]));
      }
      ctx.stroke();
    }
  }
};

document.querySelector("#load-hrtf")?.addEventListener("click", () => {
  readHrtf("./audio/full/elev0/L0e000a.dat")
    .then((array) => {
      drawGraph(array);
    })
    .catch((error) => {
      console.log(error);
    });
});
