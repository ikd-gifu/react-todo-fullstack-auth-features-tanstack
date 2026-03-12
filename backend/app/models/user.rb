class User < ApplicationRecord
  # bcryptを使ったパスワード暗号化
  has_secure_password
  has_many :todos, dependent: :destroy
  
  validates :email, presence: true, 
                  uniqueness: { case_sensitive: false }, 
                  format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { maximum: 50 }
  validates :password, length: { minimum: 6 }

  # メールアドレスを小文字に統一（データベース保存前）
  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase
  end
end
