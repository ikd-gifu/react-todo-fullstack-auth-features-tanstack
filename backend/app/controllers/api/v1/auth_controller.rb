module Api
  module V1
    class AuthController < ApplicationController
      # checkアクションのみ認証必須
      before_action :authenticate_user!, only: [:check]

      # 新規登録
      # POST /api/v1/auth/signup
      # params: { name:, email:, password:, password_confirmation: }
      def signup
        user = User.new(signup_params)

        if user.save
          # JWTトークンを生成
          token = AuthService.encode(user.id)
          
          render json: {
            token: token,
            user: serialize_user(user)
          }, status: :created
        else
          render json: { 
            errors: user.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      # ログイン
      # POST /api/v1/auth/login
      # params: { email:, password: }
      def login
        user = User.find_by(email: params[:email]&.downcase)

        # authenticateメソッド（has_secure_passwordが提供）でパスワード検証
        if user&.authenticate(params[:password])
          # JWTトークンを生成
          token = AuthService.encode(user.id)
          
          render json: {
            token: token,
            user: serialize_user(user)
          }
        else
          render json: { 
            error: 'メールアドレスまたはパスワードが正しくありません' 
          }, status: :unauthorized
        end
      end

      # 認証チェック（トークンの有効性確認）
      # GET /api/v1/auth/check
      # Header: Authorization: Bearer <token>
      def check
        # authenticate_user!で既に認証済み
        render json: {
          user: serialize_user(current_user)
        }
      end

      private

      # Strong Parameters（新規登録用）
      def signup_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      # ユーザー情報をシリアライズ（パスワードを含めない）
      def serialize_user(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      end
    end
  end
end
