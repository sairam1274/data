class StaticController < ApplicationController
  def home

  end

  def about
  end

  def contact
  end

 
  def index
    
  end

  

  def comment_analizer
  	user_comments = JSON.parse(Review.all.to_json)
  	user_comments.each do |comment|
      commens = comment["comments"]
      @sentiment = JSON.parse(Sentimentalizer.analyze("#{commens}"))
    end  
  end




  # def sentimentilizer_show_method
  #   ## Sentimentalizer Methods (Analyze review String)
  #     @analyze_review = Sentimentilizer.analyze(@review_string)
  #   ##Parsed JSON
  #     @review_result    = JSON.parse(@review_string)

  #   ##Probablility
  #     @review_probability = @review_result["probability"] 
  #   ##Sentiment
  #     @review_sentiment = @review_result["sentiment"]
  # end




  ## Sentimentalizer Methods (Analyze review String)
    # @analyze_review = Sentimentilizer.analyze(@review_string)
    ##Parsed JSON
    # @review_result    = JSON.parse(@review_string)

    ##Probablility
    # @review_probability = @review_result["probability"] 
    ##Sentiment
    # @review_sentiment = @review_result["sentiment"]


end
