class Cont0Controller < ApplicationController
  skip_before_filter  :verify_authenticity_token

  def blank
    logger.debug "------ debug: cont0#blank -----"
    logger.debug params[:sentence]
    render :text => "coming from rails cont0#blank"
  end
end
