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
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
// const ctx = new (window.AudioContext || window.webkitAudioContext)();
const ctx = new window.AudioContext();
let sampleSource;
const gainNode = ctx.createGain();
gainNode.gain.value = 0.5;
let oscillator;
let isPlaying = false;
const playMusic = () => {
    const audioElement = document.querySelector("audio");
    if (audioElement != null) {
        const track = ctx.createMediaElementSource(audioElement);
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
    }
    else {
        alert("cannot use audio element");
    }
};
// 音源を取得しAudioBuffer形式に変換して返す関数
const setupSe = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("./audio/se.mp3");
    const arrayBuffer = yield response.arrayBuffer();
    // Web Audio APIで使える形式に変換
    const audioBuffer = yield ctx.decodeAudioData(arrayBuffer);
    // const audioBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    // // 一様乱数でノイズ生成
    // // データを格納した実際の ArrayBuffer が得られる．
    // const nowBuffering = audioBuffer.getChannelData(0);
    // for (let i = 0; i < nowBuffering.length; ++i) {
    //   // Math.random() は [0; 1.0]. 音声は [-1.0; 1.0] である必要がある
    //   // nowBuffering[i] = Math.random() * 2 - 1;
    //   nowBuffering[i] = Math.sin(i / 100.0);
    // }
    return audioBuffer;
});
const playSe = () => __awaiter(void 0, void 0, void 0, function* () {
    // 再生中なら二重に再生されないようにする
    if (isPlaying)
        return;
    const sample = yield setupSe();
    sampleSource = ctx.createBufferSource();
    // 変換されたバッファーを音源として設定
    sampleSource.buffer = sample;
    // 出力につなげる
    sampleSource.connect(ctx.destination);
    sampleSource.start();
    isPlaying = true;
});
const stopSe = () => {
    sampleSource === null || sampleSource === void 0 ? void 0 : sampleSource.stop();
    isPlaying = false;
};
// oscillatorを破棄し再生を停止する
const playOsc = (type) => {
    if (isPlaying)
        return;
    oscillator = ctx.createOscillator();
    oscillator.type = type; // sine, square, sawtooth, triangleがある
    oscillator.frequency.value = 440;
    oscillator.connect(gainNode).connect(ctx.destination);
    oscillator.start();
    isPlaying = true;
};
const stopOsc = () => {
    oscillator === null || oscillator === void 0 ? void 0 : oscillator.stop();
    isPlaying = false;
};
(_a = document.querySelector("#stop")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    stopOsc();
    stopSe();
});
(_b = document
    .querySelector("#osc-gain")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (payload) => {
    const strValue = payload.target.value;
    gainNode.gain.value = parseFloat(strValue);
});
// ラジオボタンで選ばれた音源を流す処理を行う
(_c = document.querySelector("#play")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const radioElement = document.getElementsByName("source");
    let sourceType = null;
    for (const n of radioElement) {
        if (n instanceof HTMLInputElement && n.checked) {
            sourceType = n.value;
        }
    }
    switch (sourceType) {
        case "music":
            playMusic();
            break;
        case "se":
            playSe().catch(() => {
                console.log("");
            });
            break;
        case "sine":
            playOsc("sine");
            break;
        case "tri":
            playOsc("triangle");
            break;
        case "saw":
            playOsc("sawtooth");
            break;
        case "square":
            playOsc("square");
            break;
        default:
            console.log("source type default");
    }
});
(_d = document.querySelector("#pause")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    const audioElement = document.querySelector("audio");
    if (audioElement != null) {
        audioElement.pause();
    }
});
