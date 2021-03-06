# == Schema Information
#
# Table name: projects
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  private    :boolean          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Project < ApplicationRecord
  validates :name, presence: true
  validates :private, inclusion: { in: [ true, false ], message: "is not defined" }

  has_many :project_members, dependent: :destroy, inverse_of: :project

  has_many :members,
    through: :project_members,
    source: :user

  has_many :pixels,
    dependent: :destroy
end
