# reverse-gsi-style
Mapbox Styleから地理院地図Vectorのスタイルを復元する試み（未完）

## 作ったプログラム
1. Mapbox Styleを`styleChange2.js`で中間ファイルに変換
2. 中間ファイルを`styleChangeLatter2.js`で地理院地図Vectorのスタイルに変換

## 進捗
とりあえず、読み込めるようになった。

現在の課題は以下の通り
* groupを復元できない（階層順を制御できない）。
* テキストのinfoはかなり決め打ちになり、Mapbox Styleを改造しすぎると対応できない。
* 基準点の標高値の表示がうまくいかない。

## 参考文献
* https://docs.mapbox.com/mapbox-gl-js/style-spec/
* https://github.com/gsi-cyberjapan/gsimaps-vector-style-spec-converter)
* https://maps.gsi.go.jp/help/pdf/vector/stylespec.pdf

