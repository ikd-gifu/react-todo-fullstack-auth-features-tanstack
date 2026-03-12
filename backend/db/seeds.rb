# ユーザーを作成
user = User.create!(
  name: "田中太郎",
  email: "tanaka@example.com",
  password: "password",
  password_confirmation: "password"
)

# Todoを作成（user_idを紐付け）
Todo.create!([
  {
    title: "ReactでTodoアプリを作成する",
    content: "React Router v7を使って画面遷移を実装する",
    user: user
  },
  {
    title: "CSS Modulesを理解する",
    content: "スコープ付きスタイリングの仕組みを学ぶ",
    user: user
  },
  {
    title: "コンポーネント設計を学ぶ",
    content: "Atomic Designパターンを実践する",
    user: user
  },
  {
    title: "状態管理を実装する",
    content: "Context APIとカスタムフックで状態管理",
    user: user
  }
])

puts "Seed data created: #{User.count} user, #{Todo.count} todos"
