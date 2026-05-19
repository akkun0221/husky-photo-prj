# reference-jsx — 参考実装

このフォルダの JSX は **プレーン React + 直書き style オブジェクト** で
書かれています。設計の意図（色値・letter-spacing・回転角・余白）を
曖昧さなく伝えるため、Tailwind を使っていません。

本実装では既存プロジェクトの Tailwind + TypeScript に書き直してください。

## ファイル依存関係

トップレベル（globals に Object.assign で公開）でお互いを参照しています。
依存順は以下:

```
shared.jsx
  ├─ PALETTE, LIVES, MEMBERS, YEARS  ← 全ファイルで使用
  ├─ PhotoStage, useRandomSlide
  ├─ useActiveYear, useDirection, sortedLives, yearCounts
  └─ 1度だけ injectGlobal() で .mem-* CSS を <head> に挿入

v1v2-stickybar-and-spread.jsx
  └─ StickyBarScrapbook, ScrapbookSpread, TapeStrip
     ※ V1/V2 の元バリエーション本体は使わないが、上記3つは v2plus / lives /
        members / detail で参照される共通プリミティブ

v2plus.jsx           — Top page desktop
mobile-v2plus.jsx    — Top page mobile + MobileV2PlusNav (lives, members の mobile でも使用)
lives-index.jsx      — Lives 一覧 (desktop + mobile)
members-desktop.jsx  — Members feed desktop + MembersMarquee (他で再利用)
members-mobile.jsx   — Members feed mobile
live-detail.jsx      — Live 個別 (desktop + mobile) + GalleryPhoto + detailPhotosFor
header-footer.jsx    — MemorialHeaderV2 / MemorialFooterV2 / HeaderFooterPreview
```

## どこを「移植する」か

実装に必要なのは「設計の決定値」だけです。各ファイルから抽出すべきポイント:

| ファイル                        | 抽出する設計値                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `shared.jsx`                    | パレット, mem-\* CSS, データシェイプ, `useRandomSlide` / `useActiveYear` のロジック                       |
| `v1v2-stickybar-and-spread.jsx` | `StickyBarScrapbook` のレイアウト・色・回転、`ScrapbookSpread` の grid・写真3点散らし、`TapeStrip` の SVG |
| `v2plus.jsx`                    | Top page のヒーロー文言・余白・sticky 年バンド構造                                                        |
| `mobile-v2plus.jsx`             | モバイルの 2段 nav、写真の 46–54% 幅、テキスト対角配置、スタンプ位置                                      |
| `lives-index.jsx`               | 年セクションの sticky ヘッダ、ライブ行 grid (60/50/140/1fr/auto/30)                                       |
| `members-desktop.jsx`           | フィルタチップの tape-tilt、横一列ヘッダ + columns 5                                                      |
| `live-detail.jsx`               | columns 5/3、ホバー拡大、前後ナビカード、`GalleryPhoto` の構造                                            |
| `header-footer.jsx`             | nav チップの tape-tilt、wordmark、3カラム footer、flicker                                                 |

## 直接実行（任意）

`index.html` 等は同梱していません。元の design canvas で動作確認できます。
