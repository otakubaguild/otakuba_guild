QRコード管理アップデート

追加内容:
- 管理画面に「🔳 QR」タブを追加
- 店舗ID方式（?store=店舗ID）のQR生成
- GAS直指定方式（?gas=GAS_URL）のQR生成
- URLコピー
- QR画像保存
- QRを新しいタブで開く

使い分け:
1. 店舗ID方式（推奨）
   URLが短くなる。
   ただし stores.json に店舗IDとGAS URLを書く必要あり。

2. GAS直指定方式
   stores.json編集なしですぐ使える。
   URLは長くなるが、QRなら問題なし。

あなたがやること:
- GitHubにこのZIPの中身を上書き
- 管理画面 → QR を開く
- 店舗IDまたはGAS URLを入力
- QRを保存して印刷/共有
