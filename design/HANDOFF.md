# husky photo — デザイン引き渡し

実装担当（Claude Code 含む）向けの仕様メモ。

---

## 1. プロジェクト概要

- 解散済みバンド **husky** の **写真アーカイブサイト**（個人サイト）
- オーナー（=写真家）が撮影した写真をライブ別・メンバー別に公開
- **撮影記録期間**: 2022.12.10 〜 2026.04.27
- **公演数**: 13（うち最終公演 = 2026.04.27 解散ワンマンライブ）
- **管理者**: オーナー1名のみ（写真の追加・削除・タグ付け権限）
- **訪問者**: 閲覧のみ（ログイン不要）

## 2. このフォルダ（design/）の中身

```
design/
├── variant-memorial.jsx   ← デザイン正本 (採用案 = Memorial Timeline)
├── husky-common.jsx       ← HUSKY サンプルデータ + プレースホルダー部品
└── HANDOFF.md             ← このファイル
```

**実装のソース・オブ・トゥルース** は `variant-memorial.jsx`。
`husky-common.jsx` はデータ型と `StripePlaceholder` / `PortraitPlaceholder` / `LockIcon` / `Arrow` などのプレースホルダー部品を提供（実装側で実画像／本物のアイコンに置き換える）。

## 3. サイト構造

```
/                  ← トップ (Memorial Timeline)
/lives             ← 全ライブ一覧
/lives/[id]        ← ライブ単体のフォトギャラリー
/members           ← 全メンバー一覧
/members/[id]      ← メンバー単体のフォトギャラリー
/about             ← サイト概要
/admin             ← オーナーのみ・写真管理
```

## 4. データモデル

```ts
type Live = {
  id: string; // 'l01'..'l13'
  date: string; // '2026.04.27' (YYYY.MM.DD)
  weekday: string; // 'MON' etc
  venue: string;
  city: string;
  count: number; // この公演の写真枚数
  title?: string;
  note?: string; // 写真家の一言 (任意)
  final?: boolean; // 解散ライブ
  first?: boolean; // 初撮影
  heroPhotoId?: string; // カード用のサムネ
};

type Member = {
  id: string; // 'm01'..'m05'
  role: string; // 'Vo.', 'Gt.', ...
  name: string;
  shots: number; // 撮影枚数 (集計値)
  heroPhotoId?: string;
};

type Photo = {
  id: string;
  src: string; // CDN URL
  width: number;
  height: number;
  liveId: string;
  memberIds: string[]; // 写っているメンバー (タグ)
  takenAt: string; // ISO datetime
  caption?: string;
};
```

データは DB から取得する前提（コード内のサンプル `HUSKY` は無視）。

## 5. トップページ要件（採用デザイン =Memorial Timeline）

### 必須セクション

1. **Header**: ロゴ + 🔒 admin リンク + nav (top / lives / members / about)
2. **Opening monument**: 「2022 — 2026」の巨大タイポ + 写真家の導入文 + サマリー
3. **Sticky Jump Bar**（スクロールしても上部固定）:
   - Direction toggle: ▶ 追体験 (2022→2026, デフォルト) / ◀ 振り返り (2026→2022)
   - 年 pill: 2022 / 2023 / 2024 / 2025 / 2026（クリックで該当年へジャンプ）
   - メンバーショートカット: 5 人のロールアイコン → `/members/[id]`
4. **Timeline**: 中央スパインに沿って alternating-side で 13 ライブを配置
   - 各カード = 日付（大）/ 写真 / 会場 / 枚数 / リンク
   - first（2022.12.10）と final（2026.04.27）は特別演出
   - 年の境目に年マーカー
5. **Members rail**: 5 人のポートレートを横並び → `/members/[id]`
6. **Footer**: クレジット + 🔒 admin

### インタラクション

- Direction toggle: クライアントステート。URL クエリ `?dir=reverse` で永続化
- 年 pill: `<a href="#y2024">` でアンカージャンプ + `scroll-behavior: smooth`
- メンバーショートカット: `<a href="/members/{id}">` 通常遷移
- ライブカード全体がリンク: `<a href="/lives/{id}">`

## 6. デザイントークン

```css
/* colors */
--bg: #0a0807; /* deep ink */
--surface: #13100e; /* card surface */
--fg: #ece6d8; /* off-white */
--sub: rgba(236, 230, 216, 0.55);
--faint: rgba(236, 230, 216, 0.15);
--rule: rgba(236, 230, 216, 0.12);
--accent: #c84a3a; /* ember red — final / interactive */

/* type */
font-display: "Playfair Display", "Noto Serif JP", serif;
font-body:
  "Inter",
  "Noto Sans JP",
  -apple-system,
  sans-serif;
font-italic: "EB Garamond", serif; /* note引用 */
font-mono: ui-monospace, "SF Mono", Menlo, monospace; /* メタ情報 */

/* spacing */
section-padding-x: 64px;
section-padding-y: 60-80px;
```

## 7. プレースホルダーの差し替え

- `StripePlaceholder` / `PortraitPlaceholder` は実装側で `<Image>` に置き換え
- `label` 引数（例: `"BIGCAT_2026.04.27"`）はファイル名の参考。実際の src は DB から
- 写真が未登録のライブ・メンバーには、デザインのストライプパターンを `PhotoFallback` コンポーネントとして再現してフォールバック表示

## 8. アクセシビリティ・SEO

- 写真 alt: `{venue} - {date} - {memberRole}` の合成
- `<meta name="description">`: "a photographer's archive of husky · 2022–2026"
- 暗モード固定（システム設定に追従しない、デザインの一部）
- キーボード: 年 pill / メンバーショートカット / direction toggle すべて Tab で辿れること

## 9. 管理機能（後回しでOK）

- 認証: メールリンク or OAuth でオーナーのみ
- アップロード: 複数選択 → ライブ・メンバータグ付け → サムネ自動生成
- 編集: 既存写真のタグ修正・削除
- ライブ追加: 日付・会場・都市を入力 → 写真をひも付け

---

具体的な実装手順 → `RETROFIT.md` を参照。
