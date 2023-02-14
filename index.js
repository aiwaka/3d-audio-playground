"use strict";
var _a, _b, _c;
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
// const ctx = new (window.AudioContext || window.webkitAudioContext)();
const ctx = new window.AudioContext();
const gainNode = ctx.createGain();
gainNode.gain.value = 0.2;
let lfoNode;
let lfoDepth;
let isPlaying = false;
let sourceNode = null;
const setMusicSource = () => {
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {
            console.log("resume");
        });
        return;
    }
    const audioElement = document.querySelector("audio");
    if (audioElement != null) {
        sourceNode = ctx.createMediaElementSource(audioElement);
    }
};
const setSeSource = () => {
    //   const response = await fetch("./audio/se.mp3");
    //   const arrayBuffer = await response.arrayBuffer();
    //   // Web Audio APIで使える形式に変換
    //   const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const audioBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    // 一様乱数でノイズ生成
    // データを格納した実際の ArrayBuffer が得られる．
    const nowBuffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < nowBuffering.length; ++i) {
        // Math.random() は [0; 1.0]. 音声は [-1.0; 1.0] である必要がある
        nowBuffering[i] = Math.random() * 2 - 1;
    }
    sourceNode = ctx.createBufferSource();
    sourceNode.buffer = audioBuffer;
};
const setOscSource = (type) => {
    sourceNode = ctx.createOscillator();
    sourceNode.type = type; // sine, square, sawtooth, triangleがある
    sourceNode.frequency.value = 440;
};
(_a = document.querySelector("#stop")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    if (sourceNode instanceof MediaElementAudioSourceNode) {
        const audioElement = document.querySelector("audio");
        if (audioElement != null) {
            audioElement.pause();
        }
    }
    else {
        sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.stop();
    }
    isPlaying = false;
});
(_b = document
    .querySelector("#osc-gain")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (payload) => {
    const strValue = payload.target.value;
    gainNode.gain.value = parseFloat(strValue);
});
// ラジオボタンで選択されたソースの種類を取得
const getSourceType = () => {
    const radioElement = document.getElementsByName("source");
    let sourceType = null;
    for (const n of radioElement) {
        if (n instanceof HTMLInputElement && n.checked) {
            sourceType = n.value;
        }
    }
    return sourceType;
};
// ラジオボタンで選ばれた音源を流す処理を行う
(_c = document.querySelector("#play")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    if (isPlaying) {
        console.log("now playing");
        return;
    }
    const sourceType = getSourceType();
    switch (sourceType) {
        case "music":
            setMusicSource();
            break;
        case "se":
            setSeSource();
            break;
        case "sine":
            setOscSource("sine");
            break;
        case "tri":
            setOscSource("triangle");
            break;
        case "saw":
            setOscSource("sawtooth");
            break;
        case "square":
            setOscSource("square");
            break;
        default:
            console.log("source type default");
            return;
    }
    // ソースノードが存在しているはずなのでゲインと出力に接続
    sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.connect(gainNode).connect(ctx.destination);
    if (sourceNode instanceof MediaElementAudioSourceNode) {
        const audioElement = document.querySelector("audio");
        if (audioElement != null) {
            // NOTE: Web Audio APIの仕様でいきなり音を流すことができない.
            // そのため最初に音楽を流そうとすると失敗する（他のアクションならstart扱いだから可能？）.
            audioElement.play().catch(() => { });
        }
    }
    else {
        if (sourceNode instanceof OscillatorNode) {
            // lfoを設定
            lfoNode = ctx.createOscillator();
            lfoDepth = ctx.createGain();
            lfoDepth.gain.value = 50;
            lfoNode.type = "sine";
            lfoNode.frequency.value = 10.0;
            lfoNode.connect(lfoDepth).connect(sourceNode.frequency);
            lfoNode.start();
        }
        sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.start();
    }
    isPlaying = true;
});
