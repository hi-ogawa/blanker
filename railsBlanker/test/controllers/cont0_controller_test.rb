require 'test_helper'

class Cont0ControllerTest < ActionController::TestCase
  test "should get blank" do
    get :blank
    assert_response :success
  end

end
