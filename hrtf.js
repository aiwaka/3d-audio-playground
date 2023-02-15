const readHrtf = async (path) => {
    const response = await fetch(path);
    //  バイナリをarrayBuffer形式で保持
    const hrtfBuffer = await response.arrayBuffer();
    // バイナリを読み出すためのビューを作成
    const hrtfView = new DataView(hrtfBuffer);
    const result = [];
    for (let i = 0; i < 1024; i += 2) {
        // ビッグエンディアンを明示し, 符号付き16bit整数としてバイナリを読み出してリストに保存する.
        result.push(hrtfView.getInt16(i, false));
    }
    return result;
};
// フォームの値からHRTFデータのファイル名を作成する.
const makeFilepath = (lr) => {
    const elevForm = document.querySelector("#elev");
    const aziForm = document.querySelector("#azi");
    const elev = elevForm.value;
    const aziValue = aziForm.value;
    // 右のhrtfは左のものを対称に考えたものを使う.
    // 刻みが整数でない方位角に対してもうまくいくのでok.
    const azi = lr === "L" ? aziValue : ((360 - parseInt(aziValue)) % 360).toString();
    // NOTE: padStartはES1027準拠らしいのでtsconfig.jsonのtargetをesnextに変更した.
    const paddedAzi = azi.padStart(3, "0");
    const path = `./audio/full/elev${elev}/L${elev}e${paddedAzi}a.dat`;
    return path;
};
export { readHrtf, makeFilepath };
