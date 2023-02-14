"use strict";
const readHrtf = async (path) => {
    const response = await fetch(path);
    //  バイナリをarrayBuffer形式で保持
    const hrtfBuffer = await response.arrayBuffer();
    // バイナリを読み出すためのビューを作成
    const hrtfView = new DataView(hrtfBuffer);
    const result = [];
    for (let i = 0; i < 1024; i += 2) {
        // ビッグエンディアンを明示し, 符号付き16bit整数としてバイナリを読み出してリストに保存する.
        result.push(hrtfView.getInt16(i, false));
    }
    return result;
};
// [-2^{15}, 2^{15}-1]の数値を[0, 511]に変換する
const numToY = (num) => {
    return ((num + 32768.0) / 65536.0) * 511.0;
};
// canvas要素の描画コンテクストを取得する操作
const getCanvasRenderingContext2D = () => {
    const canvas = document.querySelector("canvas");
    if (canvas !== null) {
        const ctx = canvas.getContext("2d");
        if (ctx !== null) {
            return ctx;
        }
    }
    return null;
};
const drawGraph = (data) => {
    const ctx = getCanvasRenderingContext2D();
    if (ctx !== null) {
        ctx.beginPath();
        ctx.moveTo(0, numToY(0));
        for (let i = 0; i < 512; i++) {
            ctx.lineTo(i, numToY(data[i]));
        }
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
        }
    }
};
// フォームの値からHRTFデータのファイル名を作成する.
const makeFilepath = () => {
    const lrForm = document.querySelector("#lr");
    const elevForm = document.querySelector("#elev");
    const aziForm = document.querySelector("#azi");
    const lr = lrForm.value === "left" ? "L" : "R";
    const elev = elevForm.value;
    const azi = aziForm.value;
    const paddedAzi = azi.padStart(3, "0");
    // NOTE: padStartはES1027準拠らしいのでtsconfig.jsonのtargetをesnextに変更した.
    const path = `./audio/full/elev${elev}/${lr}${elev}e${paddedAzi}a.dat`;
    return path;
};
// filepath-displayを書き換える
const changeFilepathDisplay = (path) => {
    const span = document.querySelector("#filepath-display");
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
