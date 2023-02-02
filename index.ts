/* eslint-disable @typescript-eslint/no-confusing-void-expression */
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
// const ctx = new (window.AudioContext || window.webkitAudioContext)();
const ctx = new window.AudioContext();

type SourceType = "music" | "se" | "sine" | "tri" | "saw" | "square";

interface HTMLEvent<T extends EventTarget> extends Event {
  target: T;
}
let sampleSource: AudioBufferSourceNode;
const gainNode = ctx.createGain();
gainNode.gain.value = 0.5;
let oscillator: OscillatorNode;
let isPlaying = false;

const playMusic = (): void => {
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
  } else {
    alert("cannot use audio element");
  }
};

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

const playSe = async (): Promise<void> => {
  // 再生中なら二重に再生されないようにする
  if (isPlaying) return;
  const sample = await setupSe();
  sampleSource = ctx.createBufferSource();
  // 変換されたバッファーを音源として設定
  sampleSource.buffer = sample;
  // 出力につなげる
  sampleSource.connect(ctx.destination);
  sampleSource.start();
  isPlaying = true;
};

const stopSe = (): void => {
  sampleSource?.stop();
  isPlaying = false;
};
// oscillatorを破棄し再生を停止する

const playOsc = (type: OscillatorType): void => {
  if (isPlaying) return;
  oscillator = ctx.createOscillator();
  oscillator.type = type; // sine, square, sawtooth, triangleがある
  oscillator.frequency.value = 440;
  oscillator.connect(gainNode).connect(ctx.destination);
  oscillator.start();
  isPlaying = true;
};

const stopOsc = (): void => {
  oscillator?.stop();
  isPlaying = false;
};
document.querySelector("#stop")?.addEventListener("click", () => {
  stopOsc();
  stopSe();
});

document
  .querySelector("#osc-gain")
  ?.addEventListener("change", (payload: HTMLEvent<HTMLInputElement>) => {
    const strValue = payload.target.value;
    gainNode.gain.value = parseFloat(strValue);
  });

// ラジオボタンで選ばれた音源を流す処理を行う
document.querySelector("#play")?.addEventListener("click", () => {
  const radioElement = document.getElementsByName("source");
  let sourceType: SourceType | null = null;
  for (const n of radioElement) {
    if (n instanceof HTMLInputElement && n.checked) {
      sourceType = n.value as SourceType;
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
document.querySelector("#pause")?.addEventListener("click", () => {
  const audioElement = document.querySelector("audio");
  if (audioElement != null) {
    audioElement.pause();
  }
});
