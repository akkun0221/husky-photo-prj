# 04. Migration Plan

既存プロジェクトのどのファイルに何をするか、まとめた作業リスト。

## 🔧 修正するファイル

### グローバル

| パス                            | 作業                                                                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`（または同等） | `:root` の `--memorial-*` 値を `01-design-tokens.md` で置き換え。装飾レイヤー (`mem-photo`, `mem-grain`, `mem-marquee`, `mem-flicker`, `mem-pulse-dot`) を末尾に追加 |
| `app/layout.tsx`                | Google Fonts に `Special Elite`, `Shippori Mincho`, `JetBrains Mono` を追加                                                                                          |
| `tailwind.config.ts`            | `fontFamily.{serif,jp,mono,type}` を CSS 変数経由で追加（任意）                                                                                                      |

### 共通プリミティブ（新規）

| パス                                      | 内容                                                    |
| ----------------------------------------- | ------------------------------------------------------- |
| `widgets/Memorial/PhotoStage.tsx`         | `useRandomSlide` フック + `<PhotoStage>` コンポーネント |
| `widgets/Memorial/StickyBarScrapbook.tsx` | 共通 Sticky バー                                        |
| `widgets/Memorial/PhotoMarquee.tsx`       | 公演タイトル流れマーキー                                |
| `widgets/Memorial/StickyYearBand.tsx`     | sticky 年見出し                                         |
| `widgets/Memorial/TapeStrip.tsx`          | 装飾テープ片                                            |
| `widgets/Memorial/GalleryPhoto.tsx`       | columns 内 1 枚カード（ホバー拡大）                     |

### 既存コンポーネントの置き換え

| 既存ファイル                                      | 作業内容                                                                            | 参考 reference-jsx                            |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| `widgets/MemorialClient/MemorialClient.tsx`       | 全面書き換え。Sticky bar + マーキー + 新ヒーロー + 年ごと section + ScrapbookSpread | `v2plus.jsx`, `mobile-v2plus.jsx`             |
| `widgets/MemorialHeader/MemorialHeader.tsx`       | tape-tilt nav + 琥珀□ + husky/photo wordmark                                        | `header-footer.jsx`                           |
| `widgets/MemorialFooter/MemorialFooter.tsx`       | 3カラムレイアウト + flicker thank-you                                               | `header-footer.jsx`                           |
| `app/lives/page.tsx`                              | 全面書き換え。マーキー + Sticky bar + 年セクション + ライブ行リスト                 | `lives-index.jsx`                             |
| `app/members/page.tsx`                            | 同テイストに                                                                        | `members-desktop.jsx`                         |
| `features/filter-photos/MemorialMemberFilter.tsx` | tape-tilt チップ + 色 swatch、active 強化                                           | `members-desktop.jsx` 内 `MembersFilterChips` |
| `widgets/MemberPhotoFeed/MemberPhotoFeed.tsx`     | ライブヘッダ横一列 + CSS columns 5（mobile 3）の写真ギャラリー                      | `members-desktop.jsx` 内 `MemberPhotoSpread`  |
| `app/lives/[id]/page.tsx` 周辺                    | 巨大日付ヘッダ + lineup + 赤スタンプ + CSS columns 5 ギャラリー + 前後ナビ          | `live-detail.jsx`                             |
| `widgets/PhotoGrid/PhotoGrid.tsx`                 | **CSS columns 5/3 で aspect 保持** に。photo クリックは既存のロジック流用           | `live-detail.jsx` 内 `GalleryPhoto`           |

## 🗑 削除するファイル / 呼び出し箇所

| パス                                          | 理由                                                                                | 削除手順                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `widgets/OpeningMonument/OpeningMonument.tsx` | V2+ Memorial 冒頭ヒーロー（`a long howl, for husky.` + JP サブ + 公演数）と完全重複 | ファイル削除 + 呼び出し元 `app/page.tsx` から `<OpeningMonument />` を削除           |
| `widgets/MembersRail/MembersRail.tsx`         | Sticky バーのメンバー swatch + `/members` ページで発見性確保済み                    | ファイル削除 + 呼び出し元 `app/page.tsx` から `<MembersRail members={...} />` を削除 |

## 📋 仕様の重要ポイント

- **写真スライドショー**: 各カードが独自タイミング (2400–5800ms ランダム)
  で切り替わる。`setInterval` を 1つで共有しない。
- **年見出しの sticky stacking**: 年ごとに `<section>` を切り、その先頭に
  `position: sticky; top: 56px` の年バンドを置く。次の年セクションが
  入ってくると自動的に押し出される。
- **写真は縦横比保持**: PhotoGrid を CSS `column-count: 5`（mobile 3）に。
  各 `<img>` は `aspect-ratio` を画像の実比率に合わせ、`object-fit`
  は使わず元のままで。
- **direction toggle**: URL `?dir=reverse` を単一情報源とする。
  既存の `useRouter().replace` 実装をそのまま流用。
- **背景動画**: 既存の YouTube 埋め込みはそのまま。今回の UI は
  `rgba(...,0.86~0.92)` 程度の透過で動画が透けるように設計。
- **コピーは未確定**: `2022: 出会いの年。` などの年サブ文言、`a long howl, for husky.`
  のメインタイトルは仮置き。レビュー後に確定する。

## 🎨 design canvas の参照

ピクセル単位の余白・回転角・フォント階層は design canvas
（`MemorialClient Redesign.html`）でフルスクリーンで確認できます。
Claude Code には reference-jsx のコードを示しつつ、design canvas の
スクリーンショットを補助に使うのが速い。

## ✅ チェックリスト

実装完了の判断材料:

- [ ] 全ページで琥珀＋セピアのトーンが揃っている
- [ ] 写真スライドショーがカードごとにバラバラのタイミングで切り替わる
- [ ] 年見出しがスクロールで張り付き、次の年で切り替わる
- [ ] 写真ギャラリーが縦横比のままで desktop 5列 / mobile 3列
- [ ] Sticky バーにメンバーチップが出ている
- [ ] `OpeningMonument` / `MembersRail` を削除した
- [ ] 背景動画が UI 越しにうっすら透けて見える（要動画動作確認）
