## Features構成メモ（移行後）

このプロジェクトは、従来のレイヤー中心構成から `features` 中心構成へ移行しました。  
目的は、機能単位で責務を分離し、変更影響範囲を限定することです。

### 1. ディレクトリ方針

- `src/features/*`
  - 機能ごとの実装を配置（例: `auth`, `todo`, `users`）
  - 機能固有の `apis`, `components`, `hooks`, `types`, `routers` を持つ
- `src/shared/*`
  - アプリ横断で再利用する共通資産を配置
  - `components`, `constants`, `types`, `apis` など
- `src/pages/*`
  - 画面エントリ層（薄い層）
  - `features/*/components` を呼び出す役割に限定
- `src/routers/*`
  - ルーティングの入口を集約
  - `main.tsx` から `Router` を参照

### 2. コンポーネント配置ルール

- `shared/components`
  - 機能横断で使う汎用UI（例: `CommonButton`, `InputForm`）
- `features/<feature>/components/shared`
  - **その機能内だけ**で再利用するUI（例: Todo機能内共通のナビ部品）
- `features/<feature>/components/<PageOrTemplate>`
  - ページ/テンプレート専用部品

### 3. 型の配置ルール

- ドメイン実体の型は、そのドメインfeatureへ配置
  - 例: `UserType` は `features/users/types`
- 認証処理など手続き固有の型は `features/auth/types` へ配置
  - 例: `AuthType` は `features/auth/types/auth.ts`

### 4. ルーティング方針

- ルート定数は `shared/constants/navigation` に集約
- `main.tsx` は `src/routers` から `Router` を読み込む

### 5. 補足（今回の判断）

- `ButtonGroup` は Todo機能内共通として `features/todo/components/shared` に配置
- `TodoList` は `TodoTemplate` 専用のため `features/todo/components` に配置
- `AppHeader` は簡潔さを優先し、単体コンポーネントのまま運用（`shared/components/layouts/`に配置）
  - 将来複雑化した場合は「ロジック（feature）/UI（shared）」分離を検討
