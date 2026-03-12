module Api
  module V1
    class TodosController < ApplicationController
      def index
        todos = Todo.all
        render json: todos.map { |todo| serialize_todo(todo) }
      end

      # def create
      #   todo = Todo.new(todo_params)
      #   if todo.save
      #     render json: serialize_todo(todo), status: :created
      #   else
      #     render json: { errors: todo.errors.full_messages }, status: :unprocessable_entity
      #   end
      # end

      def create
        # 開発中の一時的な対処
        # TODO: 認証実装後は current_user に置き換える
        @todo = Todo.new(todo_params.merge(user_id: User.first.id))

        if @todo.save
          render json: serialize_todo(@todo), status: :created
        else
          render json: { errors: @todo.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        todo = Todo.find(params[:id])
        render json: serialize_todo(todo)
      end

      def update
        todo = Todo.find(params[:id])
        if todo.update(todo_params)
          render json: serialize_todo(todo)
        else
          render json: { errors: todo.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        todo = Todo.find(params[:id])
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

      def todo_params
        params.require(:todo).permit(:title, :content)
      end
    end
  end
end
