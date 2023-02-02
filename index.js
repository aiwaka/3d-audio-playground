var _a, _b;
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var audioElement = document.querySelector("audio");
// Web Audio API内で使える形に変換
if (audioElement !== null) {
    var track_1 = ctx.createMediaElementSource(audioElement);
    var playAudio = function () {
        if (ctx.state === "suspended") {
            ctx.resume()["catch"](function () {
                console.log("resume");
            });
        }
        // 出力につなげる
        track_1.connect(ctx.destination);
        audioElement.play()["catch"](function () {
            console.log("play");
        });
    };
    (_a = document.querySelector("#play")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", playAudio);
    var pauseAudio = function () {
        audioElement === null || audioElement === void 0 ? void 0 : audioElement.pause();
    };
    // audioElementを一時停止する
    (_b = document.querySelector("#pause")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", pauseAudio);
}
