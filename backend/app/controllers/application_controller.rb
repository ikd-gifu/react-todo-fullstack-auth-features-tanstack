class ApplicationController < ActionController::API

  rescue_from StandardError do |exception|
    # 本番は固定メッセージ、開発/テストのみ詳細を返す
    detail =
      if Rails.env.production?
        "internal server error"
      else
        exception.message
      end

    render json: {
      errors: [
        {
          status: "500",
          title: "Internal Server Error",
          detail: detail,
          code: "internal_error"
        }
      ]
    }, status: :internal_server_error
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {
      errors: [
        {
          status: "404",
          title: "Not Found",
          detail: exception.message,
          code: "not_found"
        }
      ]
    }, status: :not_found
  end

  rescue_from AuthenticationError do |exception|
    render json: {
      errors: [
        {
          status: "401",
          title: "Unauthorized",
          detail: exception.message,
          code: "unauthorized"
        }
      ]
    }, status: :unauthorized
  end

  private

  # 現在のユーザーを取得（メモ化）
  # @return [User, nil]
  def current_user
    @current_user ||= authenticate_request
  end

  # リクエストを認証し、ユーザーを返す
  # @return [User, nil]
  def authenticate_request
    # Authorizationヘッダーからトークンを取得
    token = AuthService.extract_token(request.headers)
    return nil unless token

    # トークンをデコード
    decoded = AuthService.decode(token)
    return nil unless decoded

    # デコードしたuser_idからユーザーを検索
    User.find_by(id: decoded[:user_id])
  rescue ActiveRecord::RecordNotFound
    nil
  end

  # 認証を必須にする（before_actionで使用）
  # current_userメソッドでauthenticate_requestを実行しトークン検証する
  def authenticate_user!
    raise AuthenticationError, 'ログインが必要です' unless current_user
  end

  # 認証エラーのレスポンス
  def authentication_error(exception)
    render json: { error: exception.message }, status: :unauthorized
  end
end
