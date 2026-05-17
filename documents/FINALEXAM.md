1. SSR / SSG / CSR / ISRの使い分け
   a. 公式ドキュメントの Rendering のセクションを読んで、CSR / SSR / SSG / ISR
   それぞれが「いつHTMLを生成するか」という軸で違いを理解してください。
   b. 手を動かしてそれぞれの違いを確認してください。

- Next.js の App Router を使って、Server Component / Client Component の使い分けを
  実際に試してみてください。ページごとに dynamic / static のレンダリング挙動の違いを確認してみてください。
- 余力があれば、Vite で SPA, SSR, SSG を作ってみてください。
  各レンダリング手法についての理解がより深まると思います。
  c. 「XXという特徴のあるシステムの場合はSSR / SSG / CSR / ISRのどれが最適か」を
  言語化できるようにしてください。

---

2.  コンポーネント設計
    　a. アトミックデザイン（Atoms / Molecules / Organisms / Templates / Pages）の考え方を理解してください。
    各レイヤーの責務の違いと「どこに何を置くか」の判断軸を整理しておくと、チームへの設計説明がしやすくなります。
    　b. Feature-Sliced Design や Bulletproof React を一読し、ディレクトリ構成の設計パターンを把握してください。
    　c. 「このコンポーネントはどのレイヤーに置くべきか」「このロジックはカスタムフックに切り出すべきか」などをチームに説明できるようにしてください。

---

3.  Provider 設計
    　a. React の Context API が何を解決するものかを理解してください。
    　b. 小さいアプリで認証・テーマ・ロケールなど責務の異なる Provider を実際に作り、ネストの整理を体験してください。
    　c. 「何を Provider で管理し、何を管理しないか」の方針を言語化できるようにしてください。Provider が深くネストしてしまうパターン（認証・テーマ・ロケール・トースト通知などを全部 Context で管理してしまうケース）と、Zustand など状態管理ライブラリへの切り出しで回避する方法を説明できる状態を目指してください。

---

4.  状態管理ライブラリの選定
    　a. Zustand・TanStack Query・Jotai・Redux それぞれが「何の状態を管理するか」という軸で違いを理解してください。
    　b. 手を動かしてそれぞれの役割の違いを確認し、「どんなPJではどのライブラリが最適か」を言語化できるようにしてください。

---

5.  デプロイ戦略
    a. Vercel・Cloudflare Workers それぞれの仕組みと特徴を理解してください。
    b. 手を動かしてデプロイを体験してください。

- Vercel は Git 連携による自動デプロイを試し、PR ごとにプレビュー環境が作られる流れを確認してください。CLI や GitHub Actions 経由でのデプロイも一通り触れてみてください。
- Cloudflare Workers はGitHub Actions 連携でデプロイしてみてください。Edge Runtime 前提のため Node.js 固有 API（fs など）が使えない制約を実際に確認しておくと良いです。
- Vercel の Middleware（middleware.ts）を使った Basic 認証をステージング環境にだけかける構成を試してみてください。
- 「このPJでは Vercel と Cloudflare Workers どちらが適切か」をコスト・制約・要件の観点から説明できるようにしてください。
