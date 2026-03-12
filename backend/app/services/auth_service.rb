class AuthService
  # 環境変数から直接取得
  SECRET_KEY = ENV['JWT_SECRET']
  
  # JWTの有効期間（24時間）
  # Rails起動時のクラス読み込み時に評価される
  TOKEN_TTL = 24.hours
  # この実装だと起動時から24時間の固定値になる
  # EXPIRATION_TIME = 24.hours.from_now

  # JWTトークンを生成
  # @param user_id [Integer] ユーザーID
  # @return [String] JWTトークン
  def self.encode(user_id)
    payload = {
      user_id: user_id,
      # encodeを呼び出した時刻を基準に有効期限を計算（UNIX時刻）
      exp: TOKEN_TTL.from_now.to_i
    }
    
    # JWTライブラリを使って署名付きトークンを生成
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  # JWTトークンをデコード（検証）
  # @param token [String] JWTトークン
  # @return [Hash, nil] デコード結果（失敗時はnil）
  def self.decode(token)
    # トークンを検証してデコード
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
    
    # デコード結果の最初の要素がペイロード
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError => e
    # トークンが無効な場合（改ざん、期限切れなど）
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end

  # Authorizationヘッダーからトークンを抽出
  # @param headers [Hash] リクエストヘッダー
  # @return [String, nil] トークン（ヘッダーがない場合はnil）
  # この処理は stateless（状態非依存）
  def self.extract_token(headers)
    # Authorization: Bearer <token> の形式から<token>を抽出
    auth_header = headers['Authorization']
    return nil unless auth_header

    # "Bearer "の部分を除去
    auth_header.split(' ').last if auth_header.start_with?('Bearer ')
  end
end
