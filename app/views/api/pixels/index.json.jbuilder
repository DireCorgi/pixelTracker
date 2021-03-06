@pixels.each do |pixel|
  json.set! pixel.id do
    json.extract! pixel, :id, :title, :category, :description, :points, :project_id, :pixel_ord, :icebox, :state
    json.requester pixel.requester.username
    json.updated_at pixel.updated_at.strftime("%m-%d-%Y %H:%M:%S")
    json.comments do
      json.array! pixel.comments do |comment|
        json.id comment.id
        json.body comment.body
        json.user comment.user.username
        json.pixel_id comment.pixel_id
        json.created_at comment.created_at.strftime("%m-%d-%Y, %I:%M %p")
      end
    end
    json.tasks do
      json.array! pixel.tasks do |task|
        json.id task.id
        json.body task.body
        json.pixel_id task.pixel_id
        json.task_ord task.task_ord
        json.complete task.complete
      end
    end
  end
end
