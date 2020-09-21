# reverse-gsi-style
Mapbox Styleから地理院地図Vectorのスタイルを復元する試み（未完）

## 作ったプログラム
1. Mapbox Styleを`styleChange2.js`で中間ファイルに変換
2. 中間ファイルを`styleChangeLatter2.js`で地理院地図Vectorのスタイルもどきに変換

## 進捗
地理院地図Vectorのスタイルもどきは、地図表示はできない。
* draw属性値に、Mapbox Styleのpaintとlayoutをまま放り込んでいる
* テキストのinfoに適切な属性値を入れていない
といった理由が考えられる。

ただ、編集パネルでは、きちんとディレクトリ毎に展開されるっぽい。

参考文献
* https://docs.mapbox.com/mapbox-gl-js/style-spec/
* https://github.com/gsi-cyberjapan/gsimaps-vector-style-spec-converter)
* https://maps.gsi.go.jp/help/pdf/vector/stylespec.pdf

