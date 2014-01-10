class ReviewsController < ApplicationController
  
  # GET /reviews
  # GET /reviews.json
  def index
  
    @reviews = Review.all
    @reviews_string = Review.all.to_s
    ## SAD PANDA METHODS
    @reviews_emotion = SadPanda.emotion(@reviews_string)
    @reviews_polarity = SadPanda.polarity(@reviews_string)

    # @sadpanda_emotion = SadPanda.emotion.@reviews
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @reviews }
    end
  end



#####SAD PANDA
# WE are trying to get polarity,emotion from SadPanda

#### SENTI MEN ALIZER
#  Methods 
###  Sentimentilizer.analyze(string)
#   result give hash
 # Sentimenttal Analyzer
 #   @review_string = @review.review.to_s
 #   @sentiment_review = Sentimentilizer.analyze(@review_string) 
    
## Hash nunchi probrability,sentiment vasthadhi 

## dhanni manam print chesi,table lo veeyyali



### We need Parse HASH 
## print probability,sentiment 

# Sentimentalizer.analyze(review.review)
# @review_json = Sentimentalizer.analyze(review.review)
# JSON.parse(@review_json)   -- Parse JSON (RESult HASH)
# @review_result = JSON.parse(@review_json)
## 
# @review_result["probability"] 
# @review_result[0].probability



# SadPanda.emotion('string')
# SadPanda.polarity(review)
# 
  # GET /reviews/1
  # GET /reviews/1.json
  def show
    @review = Review.find(params[:id])

    ## SAD PANDA METHODS
    @review_emotion = SadPanda.emotion(@review.review)
    @review_polarity = SadPanda.polarity(@review.review)
    
    
    ## Sentimentalizer Methods (Analyze review String)
      # @analyze_review = Sentimentilizer.analyze(@review.review)
    ##Parsed JSON
      # @review_result    = JSON.parse(@analyze_review)

    ##Probablility
     # @review_probability = @review_result["probability"] 
    ##Sentiment
     # @review_sentiment = @review_result["sentiment"]


    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @review }
    end
  end

  # GET /reviews/new
  # GET /reviews/new.json
  def new
    @review = Review.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @review }
    end
  end

  # GET /reviews/1/edit
  def edit
    @review = Review.find(params[:id])
  end

  # POST /reviews
  # POST /reviews.json
  def create
    @review = Review.new(params[:review])

    respond_to do |format|
      if @review.save
        format.html { redirect_to @review, notice: 'Review was successfully created.' }
        format.json { render json: @review, status: :created, location: @review }
      else
        format.html { render action: "new" }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /reviews/1
  # PUT /reviews/1.json
  def update
    @review = Review.find(params[:id])

    respond_to do |format|
      if @review.update_attributes(params[:review])
        format.html { redirect_to @review, notice: 'Review was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reviews/1
  # DELETE /reviews/1.json
  def destroy
    @review = Review.find(params[:id])
    @review.destroy

    respond_to do |format|
      format.html { redirect_to reviews_url }
      format.json { head :no_content }
    end
  end


  def tracker
    review_analyzer
  end

  def review_analizer
    user_review = JSON.parse(Review.all.to_json)
    user_review.each do |review|
    review_emotions = review["review"]
      @sentiment = JSON.parse(Sentimentalizer.analyze("#{review_emotions}"))
    end  
  end

  







 end
