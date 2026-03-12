module Api
  module V1
    class TodosController < ApplicationController
      before_action :authenticate_user!, only: [:index, :create, :show, :update, :destroy]

      def index
        todos = current_user.todos
        render json: todos.map { |todo| serialize_todo(todo) }
      end

      def create
        # user_idを用いず他人のユーザーIDで作成することを防ぐ
        @todo = current_user.todos.build(todo_params)

        if @todo.save
          render json: serialize_todo(@todo), status: :created
        else
          render json: { errors: @todo.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        todo = current_user.todos.find(params[:id])
        render json: serialize_todo(todo)
      end

      def update
        todo = current_user.todos.find(params[:id])
        if todo.update(todo_params)
          render json: serialize_todo(todo)
        else
          render json: { errors: todo.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        todo = current_user.todos.find(params[:id])
        todo.destroy
        # 204 No Content は 成功したがレスポンスボディは空であることを示す
        head :no_content
      end

      private

      # レスポンスをcamelCase 変換
      def serialize_todo(todo)
        {
          id: todo.id,
          title: todo.title,
          content: todo.content,
          createdAt: todo.created_at&.iso8601,
          updatedAt: todo.updated_at&.iso8601
        }
      end

      # user_idはサーバ内で追加 permitしない
      def todo_params
        params.require(:todo).permit(:title, :content)
      end
    end
  end
end
