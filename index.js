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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
// const ctx = new (window.AudioContext || window.webkitAudioContext)();
const ctx = new window.AudioContext();
let sampleSource;
let oscillator;
let isPlaying = false;
// 音源を取得しAudioBuffer形式に変換して返す関数
const setupSe = () => __awaiter(void 0, void 0, void 0, function* () {
    // const response = await fetch("./audio/se.mp3");
    // const arrayBuffer = await response.arrayBuffer();
    // // Web Audio APIで使える形式に変換
    // const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const audioBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    // 一様乱数でノイズ生成
    // データを格納した実際の ArrayBuffer が得られる．
    const nowBuffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < nowBuffering.length; ++i) {
        // Math.random() は [0; 1.0]. 音声は [-1.0; 1.0] である必要がある
        // nowBuffering[i] = Math.random() * 2 - 1;
        nowBuffering[i] = Math.sin(i / 100.0);
    }
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
    const sample = yield setupSe();
    playSample(ctx, sample);
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(_a = document.querySelector("#play-se")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", playSe);
const stopSe = () => {
    console.log("stop se");
    sampleSource === null || sampleSource === void 0 ? void 0 : sampleSource.stop();
    isPlaying = false;
};
// oscillatorを破棄し再生を停止する
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(_b = document.querySelector("#stop-se")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", stopSe);
const playOsc = (type) => {
    if (isPlaying)
        return;
    oscillator = ctx.createOscillator();
    oscillator.type = type; // sine, square, sawtooth, triangleがある
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    isPlaying = true;
};
(_c = document
    .querySelector("#play-sine")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => playOsc("sine"));
(_d = document
    .querySelector("#play-saw")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => playOsc("sawtooth"));
(_e = document
    .querySelector("#play-tri")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => playOsc("triangle"));
(_f = document
    .querySelector("#play-sq")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => playOsc("square"));
const stopOsc = () => {
    oscillator === null || oscillator === void 0 ? void 0 : oscillator.stop();
    isPlaying = false;
};
(_g = document.querySelector("#stop-osc")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", stopOsc);
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
    (_h = document.querySelector("#play-music")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", playAudio);
    const pauseAudio = () => {
        audioElement === null || audioElement === void 0 ? void 0 : audioElement.pause();
    };
    // audioElementを一時停止する
    (_j = document.querySelector("#pause-music")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", pauseAudio);
}
