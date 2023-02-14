"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const readHrtf = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(path);
    //   const response = await fetch("./audio/se.mp3");
    //  バイナリをarrayBuffer形式で保持
    const hrtfBuffer = yield response.arrayBuffer();
    //   const hrtfData = new Int16Array(hrtfBuffer);
    const hrtfView = new DataView(hrtfBuffer);
    // 512サンプル1024byte分のバッファを用意し, 書き込むためのオブジェクトを作る
    //   const arrayBuffer = new ArrayBuffer(1024);
    //   const dataView = new DataView(arrayBuffer);
    //   console.log("length: ", hrtfData.length);
    //   const test = [];
    //   for (let i = 0; i < 512; i++) {
    //     test.push(hrtfData[i]);
    //     dataView.setInt16(0, hrtfData[i], false);
    //   }
    //   console.log("test", test);
    const result = [];
    for (let i = 0; i < 1024; i += 2) {
        result.push(hrtfView.getInt16(i, false));
    }
    return result;
    // const array = new Uint16Array(arrayBuffer);
    //   return new Int16Array(arrayBuffer);
});
// [-2^{15}, 2^{15}-1]の数値を[0, 511]に変換する
const numToY = (num) => {
    return ((num + 32768.0) / 65536.0) * 511.0;
};
const drawGraph = (data) => {
    const canvas = document.querySelector("canvas");
    if (canvas !== null) {
        const ctx = canvas.getContext("2d");
        if (ctx !== null) {
            //   ctx.fillStyle = "green";
            //   ctx.fillRect(10, 10, 100, 100);
            ctx.beginPath();
            ctx.moveTo(0, numToY(0));
            for (let i = 0; i < 512; i++) {
                console.log(data[i]);
                ctx.lineTo(i, numToY(data[i]));
            }
            ctx.stroke();
        }
    }
};
(_a = document.querySelector("#load-hrtf")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    readHrtf("./audio/full/elev0/L0e000a.dat")
        .then((array) => {
        drawGraph(array);
    })
        .catch((error) => {
        console.log(error);
    });
});
