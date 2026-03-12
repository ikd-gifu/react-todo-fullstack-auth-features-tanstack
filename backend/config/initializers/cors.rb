# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 許可する “呼び出し元” を指定
    origins ENV.fetch('FRONTEND_URL', 'http://localhost:5174')

    # すべての API パスを対象にする
    resource "*",
      # 任意のヘッダーと、列挙した HTTP メソッドを許可
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
