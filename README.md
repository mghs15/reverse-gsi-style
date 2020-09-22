# reverse-gsi-style
Mapbox Styleから地理院地図Vectorのスタイルを復元する試み（未完）

## 作ったプログラム
1. Mapbox Styleを`styleChange2.js`で中間ファイルに変換
2. 中間ファイルを`styleChangeLatter2.js`で地理院地図Vectorのスタイルに変換

## 進捗
とりあえず、復元後のスタイルを地理院地図Vectorで読み込めるようになった。

現在の課題は以下の通り
* groupを完全に復元できない（階層順を制御できない）。便宜的にsource-layerとpathを用いて対応。
* テキスト用のinfoは決め打ちでの設定になり、Mapbox Styleを改造しすぎると対応できない。
* hslだと、地理院地図Vector上の編集がうまくいかないので、rgbに変換しておきたい。 


## 参考文献
* https://docs.mapbox.com/mapbox-gl-js/style-spec/
* https://github.com/gsi-cyberjapan/gsimaps-vector-style-spec-converter)
* https://maps.gsi.go.jp/help/pdf/vector/stylespec.pdf

