# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SolarCharm, type: :model do
  it 'has a valid factory' do
    expect(FactoryGirl.create(:solar_charm)).to be_valid
  end
end