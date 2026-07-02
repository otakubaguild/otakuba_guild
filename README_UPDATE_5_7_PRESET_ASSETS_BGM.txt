Update 5.7 コンセプト切替時の画像/BGMテンプレ反映

修正内容:
- 管理画面 → Game設定 / コンセプトでプリセットを選んだ時、文言だけでなく以下も settings.themeCustom へ自動反映
  - スタート画面背景
  - スタートBGM
  - 討伐完了背景
  - 討伐完了中央画像
  - 討伐完了BGM
  - いいえ選択時のマスター名
  - いいえ選択時のマスター画像
  - いいえ選択時のセリフ
- 初回セットアップでテーマを選んだ時も同じテンプレが反映されます。
- プリセット側に assets がない場合は、最初の敵の背景/最後の敵の背景などを自動で仮反映します。

presets.json の推奨形式:
{
  "id": "sf",
  "label": "🚀 SF",
  "theme": {
    "brand": {
      "shopName": "銀河酒場",
      "masterName": "司令官",
      "masterImage": "commander.png"
    },
    "messages": {
      "titleWelcome": "銀河酒場へ<br>ようこそ",
      "openMenu": "ミッションを開始しますか？",
      "masterDefault": "冷やかしか？出撃準備をしろ",
      "peace": "任務完了。帰還を許可する。"
    },
    "assets": {
      "startBg": "start.png",
      "startBgm": "title",
      "victoryBg": "clear_bg.png",
      "victoryImage": "clear.png",
      "victoryBgm": "ending"
    }
  }
}

画像の置き方:
- presets/sf/start.png
- presets/sf/clear_bg.png
- presets/sf/clear.png
のように置くと、プリセット選択時に自動で参照します。
URLを直接書いた場合はそのURLを使います。

アップロードするファイル:
- admin.js
- app.js
