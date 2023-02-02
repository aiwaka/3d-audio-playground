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
var _a, _b, _c, _d;
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
let sampleSource;
let isPlaying = false;
// 音源を取得しAudioBuffer形式に変換して返す関数
const setupSample = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("./audio/se.mp3");
    const arrayBuffer = yield response.arrayBuffer();
    // Web Audio APIで使える形式に変換
    const audioBuffer = yield ctx.decodeAudioData(arrayBuffer);
    return audioBuffer;
});
// AudioBufferをctxに接続し再生する関数
const playSample = (_ctx, audioBuffer) => {
    sampleSource = _ctx.createBufferSource();
    // 変換されたバッファーを音源として設定
    sampleSource.buffer = audioBuffer;
    // 出力につなげる
    sampleSource.connect(_ctx.destination);
    sampleSource.start();
    isPlaying = true;
};
const playSe = () => __awaiter(void 0, void 0, void 0, function* () {
    // 再生中なら二重に再生されないようにする
    if (isPlaying)
        return;
    const sample = yield setupSample();
    playSample(ctx, sample);
});
(_a = document.querySelector("#play-se")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", playSe);
const stopSe = () => __awaiter(void 0, void 0, void 0, function* () {
    sampleSource === null || sampleSource === void 0 ? void 0 : sampleSource.stop();
    isPlaying = false;
});
// oscillatorを破棄し再生を停止する
(_b = document.querySelector("#stop")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", stopSe);
const audioElement = document.querySelector("audio");
// Web Audio API内で使える形に変換
if (audioElement !== null) {
    const track = ctx.createMediaElementSource(audioElement);
    const playAudio = () => {
        if (ctx.state === "suspended") {
            ctx.resume().catch(() => {
                console.log("resume");
            });
        }
        // 出力につなげる
        track.connect(ctx.destination);
        audioElement.play().catch(() => {
            console.log("play");
        });
    };
    (_c = document.querySelector("#play-music")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", playAudio);
    const pauseAudio = () => {
        audioElement === null || audioElement === void 0 ? void 0 : audioElement.pause();
    };
    // audioElementを一時停止する
    (_d = document.querySelector("#pause-music")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", pauseAudio);
}
