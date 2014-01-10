class Review < ActiveRecord::Base

  attr_accessible :review


 def sentiment_analyzer

 end


 def emotion_polarity
   @review_emotion = SadPanda.emotion(string)
   @review_polarity = SadPanda.polarity(@review.review)

 end
    
   
end
