// window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

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

  document.querySelector("#play")?.addEventListener("click", playAudio);

  const pauseAudio = (): void => {
    audioElement?.pause();
  };
  // audioElementを一時停止する
  document.querySelector("#pause")?.addEventListener("click", pauseAudio);
}
