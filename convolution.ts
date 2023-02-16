import { makeFilepath, readHrtf } from "./hrtf.js";

let isPlaying = false;

const loadSound = async (ctx: AudioContext): Promise<AudioBuffer> => {
  const response = await fetch("./audio/se.mp3");
  const arrayBuffer = await response.arrayBuffer();
  // Web Audio APIで使える形式に変換
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  return audioBuffer;
};
// [-2^15, 2^15-1]の整数データを[-1.0, 1.0]に正規化する.
const makeBufferFromNumArray = (
  ctx: AudioContext,
  array: number[]
): AudioBuffer => {
  if (array.length !== 512) {
    throw new Error("サンプルの長さが512ではありません。");
  }
  // 512サンプルのバッファを確保.
  const audioBuffer = ctx.createBuffer(1, 512, 44100);
  const nowBuffering = audioBuffer.getChannelData(0);
  for (let i = 0; i < nowBuffering.length; ++i) {
    // 音声は [-1.0; 1.0] である必要がある
    nowBuffering[i] = array[i] / 65536.0;
  }
  return audioBuffer;
};

const run = async () => {
  // hrtfが44100hzのため, 合わせるためにオプションを設定.
  const ctx = new window.AudioContext({ sampleRate: 44100 });
  // ソースを用意する
  let sourceNode: AudioBufferSourceNode;
  const sourceBuf = await loadSound(ctx);
  if (sourceBuf.numberOfChannels !== 2) {
    throw new Error("ソースがステレオではありません。設定を見直してください。");
  }
  console.log("source loaded.");
  sourceNode = ctx.createBufferSource();
  sourceNode.buffer = sourceBuf;

  // hrtfを用意する.
  const leftHrtfPath = makeFilepath("L");
  const rightHrtfPath = makeFilepath("R");
  const leftHrtfArray = await readHrtf(leftHrtfPath);
  const rightHrtfArray = await readHrtf(rightHrtfPath);
  const leftHrtfBuf = makeBufferFromNumArray(ctx, leftHrtfArray);
  const rightHrtfBuf = makeBufferFromNumArray(ctx, rightHrtfArray);
  // DEBUG: IRを使ってみる場合（このサンプルは非商用利用のみ無料）
  /*
  const irResponse = await fetch("./audio/bin_dfeq/s1_r1_bd.wav");
  const irArrayBuffer = await irResponse.arrayBuffer();
  const irBuf = await ctx.decodeAudioData(irArrayBuffer);
  //*/
  console.log("hrtf loaded.");

  // コンボルバーを用意する. ノーマライズしないことを明示する.
  const leftConvolver = new ConvolverNode(ctx, {
    buffer: leftHrtfBuf,
    disableNormalization: true,
  });
  const rightConvolver = new ConvolverNode(ctx, {
    buffer: rightHrtfBuf,
    disableNormalization: true,
  });

  // splitterとmergerを用意する.
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(2);

  // ゲインノードを作る
  const gainNode = ctx.createGain();
  const gainElement = document.querySelector<HTMLInputElement>("#osc-gain");
  gainNode.gain.value = parseFloat(gainElement ? gainElement.value : "0");

  // ノードを接続
  sourceNode.connect(splitter);
  // 両方のチャンネルを各コンボルバーに渡す.
  splitter.connect(leftConvolver, 0);
  splitter.connect(rightConvolver, 0);
  splitter.connect(leftConvolver, 1);
  splitter.connect(rightConvolver, 1);
  leftConvolver.connect(merger, 0, 0);
  rightConvolver.connect(merger, 0, 1);
  merger.connect(gainNode).connect(ctx.destination);

  console.log("play");
  isPlaying = true;
  sourceNode.start();
  sourceNode.addEventListener("ended", () => {
    sourceNode.stop();
    sourceNode.disconnect();
    ctx.close();
    console.log("finished");
    isPlaying = false;
  });
};
document.querySelector("#play")?.addEventListener("click", () => {
  if (isPlaying) {
    console.log("now playing");
    return;
  }
  run().catch((e) => {
    console.log(e);
    alert(e);
  });
});
