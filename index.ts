/* eslint-disable @typescript-eslint/no-confusing-void-expression */
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
// const ctx = new (window.AudioContext || window.webkitAudioContext)();
const ctx = new window.AudioContext();

interface HTMLEvent<T extends EventTarget> extends Event {
  target: T;
}
let sampleSource: AudioBufferSourceNode;
const gainNode = ctx.createGain();
gainNode.gain.value = 0.5;
let oscillator: OscillatorNode;
let isPlaying = false;

// 音源を取得しAudioBuffer形式に変換して返す関数
const setupSe = async (): Promise<AudioBuffer> => {
  const response = await fetch("./audio/se.mp3");
  const arrayBuffer = await response.arrayBuffer();
  // Web Audio APIで使える形式に変換
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

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
};

// AudioBufferをctxに接続し再生する関数
const playSample = (_ctx: AudioContext, audioBuffer: AudioBuffer): void => {
  sampleSource = _ctx.createBufferSource();
  // 変換されたバッファーを音源として設定
  sampleSource.buffer = audioBuffer;
  // 出力につなげる
  sampleSource.connect(_ctx.destination);
  sampleSource.start();
  isPlaying = true;
};

const playSe = async (): Promise<void> => {
  // 再生中なら二重に再生されないようにする
  if (isPlaying) return;
  const sample = await setupSe();
  playSample(ctx, sample);
};
// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector("#play-se")?.addEventListener("click", playSe);

const stopSe = (): void => {
  sampleSource?.stop();
  isPlaying = false;
};
// oscillatorを破棄し再生を停止する
// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector("#stop-se")?.addEventListener("click", stopSe);

const playOsc = (type: OscillatorType): void => {
  if (isPlaying) return;
  oscillator = ctx.createOscillator();
  oscillator.type = type; // sine, square, sawtooth, triangleがある
  oscillator.frequency.value = 440;
  // oscillator.connect(ctx.destination);
  oscillator.connect(gainNode).connect(ctx.destination);
  oscillator.start();
  isPlaying = true;
};
document
  .querySelector("#play-sine")
  ?.addEventListener("click", () => playOsc("sine"));
document
  .querySelector("#play-saw")
  ?.addEventListener("click", () => playOsc("sawtooth"));
document
  .querySelector("#play-tri")
  ?.addEventListener("click", () => playOsc("triangle"));
document
  .querySelector("#play-sq")
  ?.addEventListener("click", () => playOsc("square"));
const stopOsc = (): void => {
  oscillator?.stop();
  isPlaying = false;
};
document.querySelector("#stop-osc")?.addEventListener("click", stopOsc);

document
  .querySelector("#osc-gain")
  ?.addEventListener("change", (payload: HTMLEvent<HTMLInputElement>) => {
    const strValue = payload.target.value;
    gainNode.gain.value = parseFloat(strValue);
  });

const audioElement = document.querySelector("audio");
// Web Audio API内で使える形に変換
if (audioElement !== null) {
  const track = ctx.createMediaElementSource(audioElement);

  const playAudio = (): void => {
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

  document.querySelector("#play-music")?.addEventListener("click", playAudio);

  const pauseAudio = (): void => {
    audioElement?.pause();
  };
  // audioElementを一時停止する
  document.querySelector("#pause-music")?.addEventListener("click", pauseAudio);
}
