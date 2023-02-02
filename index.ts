// window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

let sampleSource: AudioBufferSourceNode;
let isPlaying = false;

// 音源を取得しAudioBuffer形式に変換して返す関数
const setupSample = async (): Promise<AudioBuffer> => {
  const response = await fetch("./audio/se.mp3");
  const arrayBuffer = await response.arrayBuffer();
  // Web Audio APIで使える形式に変換
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
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
  const sample = await setupSample();
  playSample(ctx, sample);
};
// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector("#play-se")?.addEventListener("click", playSe);

const stopSe = async (): Promise<void> => {
  sampleSource?.stop();
  isPlaying = false;
};
// oscillatorを破棄し再生を停止する
// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector("#stop")?.addEventListener("click", stopSe);

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
