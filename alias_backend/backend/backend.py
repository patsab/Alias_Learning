#imports for the flask_functionality
from flask import Flask, jsonify, request
from flask_cors import CORS
#imports for pymongo data managment
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import date,datetime,timedelta
#request to the predict microservice
import requests as externRequest
#check auth from auth.py
from auth import checkAuth 
#import for production server
from waitress import serve


#configs and wrappers for flask app 
app = Flask(__name__)
CORS(app)
app.config.from_pyfile('backend_config_dev.cfg')
mongo = PyMongo(app)


#Initialise collection classes to query and add data for the collections
cardsCollection = mongo.db.cards
answersCollection = mongo.db.answers
usersCollection = mongo.db.users
tagsCollection = mongo.db.tags


#Id of the card "Wie gefällt die Alias"
alias_question_id = ""
#Id of the tags-Item
tags_item_id = ""


#Url of the prediction Microservice
predictUrl = "http://correctness:5010/compare"


"""
Methods for Card Managment
"""

#Get all cards
@app.route('/cards/all', methods=['GET'])
def get_all_cards():
    output = []
    for card in cardsCollection.find():
        card['_id']=str(card['_id'])
        output.append(card)
    return jsonify({'cards':output})

#get a card form existing id
@app.route('/cards/<id>',methods=['GET'])
def get_card_info(id):
    card = cardsCollection.find_one({'_id':ObjectId(id)})
    if card is None:
        return jsonify({'error':'Card does not exist'}),200
    output={}
    output['cardId']=str(card['_id'])
    output['answer']=card['answer']
    output['question']=card['question']
    output['tags']=card['tags']
    return jsonify({'card':output})

#Get all cards with filter
#Url is something like /cards?tags=aa&tags=bb
@app.route('/cards',methods=['GET'])
def get_cards_with_filter():
    tags = request.args.getlist('tags')
    #if no tags are provided, just get all cards
    if not tags:
       return get_all_cards()
    #search cards which contains ALL tags
    #tags from request are stored as unicode and needs to be encoded to UTF8
    output = []
    for card in cardsCollection.find({"tags":{"$all":[str(tag) for tag in tags]},'latest':True}):
        tmpCard = {}
        tmpCard['cardId']=str(card['_id'])
        tmpCard['question']=card['question']
        tmpCard['answer']=card['answer']
        tmpCard['email']=card['created_by']
        tmpCard['tags']=card['tags']
        output.append(tmpCard)
    return jsonify({'cards':output})


#Create a new card
#Data gets provided via JSON in the request
@app.route('/cards', methods=['POST'])
def create_card():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    #enter valid field
    dataInsert = {}
    try:
        #fields which needed to be provided
        dataInsert['created_by']=dataRequest['email']
        dataInsert['question']=dataRequest['question']
        dataInsert['answer']=dataRequest['answer']
        dataInsert['tags']=list(dataRequest['tags'])
        #fields which are filled at Creation-Time
        dataInsert['created']=datetime.utcnow()
        dataInsert['createdSemester']=get_current_Semester()
        dataInsert['version']=1
        dataInsert['latest']=True
    except:
        return jsonify({'error':'Payload does not contain all necessary fields'}),400
    #Insert card and return id
    card = cardsCollection.insert_one(dataInsert)
    #add Tags to the DB for the overall view
    for tag in dataInsert['tags']:
        add_tag_to_list(tag)
    return jsonify({'Message':'Card "{0}" was created with id {1}'.format(dataInsert['question'],str(card.inserted_id))})


#Updates a new card
@app.route('/cards',methods=['PUT'])
def update_card():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    dataInsert = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    
    #get data from old card
    oldCardId = dataRequest['cardId']
    oldCard = cardsCollection.find_one({'_id':ObjectId(oldCardId)})
    if oldCard is None or oldCardId is None:
        return jsonify({'error':'The cardId is not valid'}),400
    
    try:
        dataInsert['created_by']=dataRequest['email']
        dataInsert['question']=dataRequest['question']
        dataInsert['answer']=dataRequest['answer']
        dataInsert['tags']=list(dataRequest['tags'])
        #fields which are filled at Creation-Time
        dataInsert['created']=datetime.utcnow()
        dataInsert['createdSemester']=get_current_Semester()
        dataInsert['version']=int(oldCard['version'])+1
        dataInsert['latest']=True
    except:
        return jsonify({'error':'Payload does not contain all necessary fields'}),400
    #Insert new card
    cardsCollection.insert_one(dataInsert)
    #set old card to latest=false
    cardsCollection.update_one({'_id':ObjectId(oldCardId)},{"$set":{'latest':False}})
    #set answers pointing to old card to set false
    answersCollection.update_many({'cardId':oldCardId},{"$set":{'latest':False}})
    return jsonify({'message':'new card was created and old card/answers were updated'})


"""
Methods for Question and Answer Managment
"""

#Generate a new qustion
@app.route('/question')
def get_question():
    tags = request.args.getlist('tags')
    #search cards which contains ALL tags
    #tags from request are stored as unicode and needs to be encoded to UTF8
    if tags:
        card = cardsCollection.aggregate([
            {"$match":{"tags":{"$all":[str(tag) for tag in tags]}}},
            {"$match":{"cardId":{"$ne":alias_question_id}}},
            {"$match":{'latest':True}},
            {"$sample":{'size':1}}])
    else:
        card = cardsCollection.aggregate([
            {"$match":{"cardId":{"$ne":alias_question_id}}},
            {"$match":{'latest':True}},
            {"$sample":{"size":1}}])
    output={}
    #if no card was found, return a default question
    output['cardId']=alias_question_id
    output['question']="Es gibt keine Fragen mit diesen Tags, erstell doch einfach eine neue Karte. Oder wenn du schonmal hier bist, beantworte einfach folgende Frage: Wie gefällt dir ALIAS?"
    output['answer']="gut" 

    #card must be looped, because result of .aggregate is a pymongo.cursor
    for c in card:
        output['cardId']=str(c['_id'])
        output['question']=c['question']
        output['answer']=c['answer']
    
    return jsonify(output)


#Create a new answer and get an automatic evaluation
@app.route('/answer',methods=['POST'])
def create_new_answer_and_get_result():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    #enter valid field
    dataInsert = {}
    try:
        #fields which are provided by the angular frontend
        dataInsert['created_by']=dataRequest['email']
        dataInsert['userAnswer']=dataRequest['userAnswer']
        dataInsert['question']=dataRequest['question']
        dataInsert['cardId']=dataRequest['cardId']
        dataInsert['correctAnswer']=dataRequest['correctAnswer']
        
        #fields which are filled at creation-time
        dataInsert['created']=datetime.utcnow()
        dataInsert['createdSemester']=get_current_Semester()
        dataInsert['predictedCorrectness']=predictCorrect(dataInsert['userAnswer'],dataInsert['correctAnswer'])
        dataInsert['cardLatest']=True
        dataInsert['userCorrectness']=[]
        dataInsert['averageCorrectness']=dataInsert['predictedCorrectness']
    except:
        return jsonify({'error':'Payload does not contain all necessary fields'}),400
    #Insert card and return id
    answer = answersCollection.insert_one(dataInsert)
    return jsonify({'Message':'Answer "{0}" was created with id {1}'.format(dataInsert['userAnswer'],str(answer.inserted_id)),
    'predictedCorrectness':str(dataInsert['predictedCorrectness']),
    'answerId':str(answer.inserted_id)})


#Get an answer to let the user validate
@app.route('/answer/validate/<email>',methods=['GET'])
def get_answer_to_validate(email):
    #check auth
    if extractMailAndCheckAuth(request,email) == False:
        return jsonify({}),403
    tags = request.args.getlist('tags')
    if tags:
        return jsonify(answer_for_evaluation(email,tags))
    else:
        return jsonify(answer_for_evaluation(email))


#Insert a new user validation
@app.route('/answer/validate',methods=['POST'])
def insert_answer_evaluation():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not valid'}),400
    if dataRequest['given'] is None or dataRequest['given_by'] is None:
        return jsonify({'error':'Payload does not contain all needed fields'}),400
    #Add the evaluation into the object and correct the averageCorrectnes
    answersCollection.update_one({"_id":ObjectId(dataRequest['answerId'])},
        {"$push" : {'userCorrectness':{'given':dataRequest['given'],'given_by':dataRequest['given_by']}}})
    #Update the averages of the answer
    update_answer_average(dataRequest['answerId'])
    return jsonify({'message':'User evaluation was added'})


#Insert the self correctness
@app.route('/answer/self',methods=['POST'])
def insert_self_correctness():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not valid'}),400
    if dataRequest['answerId'] is None or dataRequest['selfgivenCorrectness'] is None:
        return jsonify({'error':'Payload does not contain all needed fields'}),400
    #Set the selfgiven Correctness in the DB
    answersCollection.update_one({"_id":ObjectId(dataRequest['answerId'])},
        {"$set": {'selfgivenCorrectness':dataRequest['selfgivenCorrectness']}})
    #Update avg of card
    update_answer_average(dataRequest['answerId'])
    return jsonify({'message':'selfgivenCorrectness was added'})
    
"""
Methods for Saving user filter for Topics
"""

#get all user filters
@app.route('/users/<email>/filters',methods=['GET'])
def get_filters_for_user(email):
    #check auth
    if extractMailAndCheckAuth(request,email) == False:
        return jsonify({}),403
    user = usersCollection.find_one({"email":email})
    if user is None:
        return jsonify({})
    output=[]
    for filters in user['filter']:
        output.append({'title':', '.join(filters),'tags':filters})   
    return jsonify({'filters':output})


#create/add a new filter for user
@app.route('/users/filters',methods =['POST','PUT'])
def create_new_filter():
    #check auth
    if extractMailAndCheckAuth(request) == False:
        return jsonify({}),403
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
        if not dataRequest['email'] or not dataRequest['filter']:
            return jsonify({'error':'Request does not contain all needed data'}),400
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    #Add the tags in filter to the list of all tags
    for tag in dataRequest['filter']:
        add_tag_to_list(tag)
    #check if user already has some filters
    if usersCollection.find_one({"email":dataRequest['email']}) is not None:
        try:
            usersCollection.update_one({"email":dataRequest['email']},{"$addToSet":{'filter':list(dataRequest['filter'])}})
        except:
            return jsonify({'error':'filter could not be updated'}),400
        return jsonify({'message':'Filter with tags {0} was added for user {1}'.format(dataRequest['filter'],dataRequest['email'])})
    else:
        dataInsert = {}
        dataInsert['email'] = dataRequest['email']
        dataInsert['filter'] = []
        dataInsert['filter'].append(list(dataRequest['filter']))
        #insert in DB
        usersCollection.insert_one(dataInsert)
        return jsonify({'message':'Filter with tags {0} was added for user {1}'.format(dataInsert['filter'],dataInsert['email'])})


#get the filters for a user with progess included
@app.route('/users/<email>/filterProgress',methods=['GET'])
def get_filters_with_progress_for_user(email):
    #check auth
    if extractMailAndCheckAuth(request,email) == False:
        return jsonify({}),403
    #get all filters for a user
    user = usersCollection.find_one({"email":email})
    if user is None:
        return jsonify({})
    userfilters=[]
    for filters in user['filter']:
        userfilters.append({'title':', '.join(filters),'tags':filters})
    output=[]
    #for each filter get the progress
    for filter in userfilters:
        oneDay = progress_for_user(email,1,filter['tags'])
        sevenDays = progress_for_user(email,7,filter['tags'])
        tempFilter = {'filter':filter,'statistikOneDay':oneDay,'statistikSevenDays':sevenDays}
        output.append(tempFilter)
    return jsonify(output)


#get all tags as an array
@app.route('/tags/all',methods=['GET'])
def get_all_tags():
    tag = tagsCollection.find_one({'_id':ObjectId(tags_item_id)})
    return jsonify({'tags': tag['tags']})

"""
Methods for getting learning advance for user 
"""

#Get number of card in period with correctness over 50
@app.route('/users/<email>/progress',methods = ['GET'])   
def get_progress_for_user(email):
    #check auth
    if extractMailAndCheckAuth(request,email) == False:
        return jsonify({}),403
    #get tags if some are provided
    tags = request.args.getlist('tags')
    #get given timeperiod
    try:
        day = int(request.args['days'])
    except:
        day = 1
    return progress_for_user(email,day,tags)

"""
Helper Methods
"""

#get current semester dependend on current time
#SS 20 -> 15.03.20 - 29.09.20
#WS 20 -> 01.10.20 - 14.03.21
def get_current_Semester():
    time = date.today()
    year = int(time.strftime("%Y"))-2000
    month = int(time.strftime("%m"))
    if month>9:
        return "WS {0}".format(year)
    elif month<3:
        return "WS {0}".format(year-1)
    elif month == 3 and int(time.strftime("%d"))<15 :
        return "WS {0}".format(year-1)
    return "SS {0}".format(year)


#Updates the averageUserCorrection and the total averageCorrectness
def update_answer_average(answerId):
    #search for the answer
    answer = answersCollection.find_one({'_id':ObjectId(answerId)})
    sum_of_percent=0
    count=0
    newUserAvg=0
    newTotalAvg=0
    #get all user evaluation
    for evaluation in answer['userCorrectness']:
        sum_of_percent += int(evaluation['given'])
        count += 1
    if count > 0:
        newUserAvg= int(sum_of_percent/count)
    #get selfgiven Correctness
    if('selfgivenCorrectness' in answer):
        sum_of_percent += int(answer['selfgivenCorrectness'])
        count += 1
    #get predicted Correctness
    if('predictedCorrectness' in answer):
        sum_of_percent += int(answer['predictedCorrectness'])
        count += 1
    if count > 0:
        newTotalAvg=int(sum_of_percent/count)
    #update in DB
    answersCollection.update_one({"_id":ObjectId(answerId)},
        {"$set": {'averageCorrectness':newTotalAvg,'averageUserCorrectness':newUserAvg}})


#get the progress for user
def progress_for_user(email,dayPeriod=1,tags=[]):
    #get relevant period
    startTime = datetime.utcnow() - timedelta(days=dayPeriod)
    #get data for user
    count_overall = 0
    count_correct = 0
    sum_correctness = 0
    #if tags are provided collect all answers in the time period and check if the card which was answered has the tags
    if tags:
        temp_all_answers = answersCollection.find({'created': {'$gte': startTime},'created_by':email})
        all_answers=[]
        #Check for each answer if the appropiate card contains the tags
        for answer in temp_all_answers:
            card = cardsCollection.find_one({'_id':ObjectId(answer['cardId'])})
            #check if the appropiate card contains all tags
            if (set(tags).issubset(set(card['tags']))):
                all_answers.append(answer)
    else:
        all_answers = answersCollection.find({'created': {'$gte': startTime},'created_by':email}) 
    #create statistik based on cards with an avg >= 50
    for answer in all_answers:
        count_overall += 1
        sum_correctness+=int(answer['averageCorrectness'])
        if answer['averageCorrectness'] >= 50:
            count_correct += 1
    averageCorrectness=0
    if count_overall != 0:
        averageCorrectness=int(sum_correctness/count_overall)
    return {'cardsCorrect':count_correct,'cardsOverall':count_overall,'averageCorrectness':averageCorrectness}


#add a new tag to the tags object in the db
def add_tag_to_list(tag):
    tagsCollection.update_one({'_id':ObjectId(tags_item_id)},{"$addToSet":{'tags':tag}})


#get a question for evaluation
def answer_for_evaluation(email,tags=[]):
    #if tags are provided, get an answer to a question with these tags
    if tags:
        #get all cards which match the tags
        cardIDs =[]
        cards = cardsCollection.find({"$match":{"tags":{"$all":[str(tag) for tag in tags]}}})
        for card in cards:
            cardIDs.append(str(card['tags']))
        #get an answer where the cardID is one of these 
        answer = answersCollection.aggregate([
            {"$match":{"cardId":{"$in":cardIDs}}},
            {"$match":{"created_by":{"$ne":email}}},
            {"$match":{'cardLatest':True}},
            {"$sample":{"size":1}}])
    #get an answer where tags does not matter
    else:
        answer = answersCollection.aggregate([
            {"$match":{'cardLatest':True}},
            {"$match":{'cardId':{"$ne":alias_question_id}}},
            {"$match":{"created_by":{"$ne":email}}},
            {"$sample":{"size":1}}])
    output = {}
    #even if its only 1 element in answer it needs to be looped with for
    #because the result of .aggregate is a pymongo.cursor
    for a in answer:
        output['question']=a['question']
        output['correctAnswer']=a['correctAnswer']
        output['userAnswer']=a['userAnswer']
        output['answerId']=str(a['_id'])
        return output
    #if no a in answer, return an empty question
    output['question']=""
    output['correctAnswer']=""
    output['userAnswer']=""
    output['answerId']=""
    return output


#extract mail from request
def extractMailAndCheckAuth(req,UserEmail=""):
    email = UserEmail
    token = ""
    #in some routes the email is included in the route
    #so only get the email out of the request if it isnt provided in the URL
    if email == "":
        if req.method == "POST" or req.method == "PUT":
            email=req.get_json()
            email = email['email']
        if req.method == "GET":
            email=req.args.get('email') 
    #get the token out of the header
    token = req.headers.get('Authorization')
    #if one of the two things isn't provided, return false
    if token =="" or email =="":
        return False
    #the auth check is done via the imported skript auth.py
    return checkAuth(email,token)


#makes an REST call to  the correctness microservice 
def predictCorrect(userAnswer,correctAnswer):
    try:
        payload = {'userAnswer':userAnswer, 'correctAnswer':correctAnswer}
        response = externRequest.get(predictUrl,params=payload)
        #set a default value if the correctness service fails
        if response.status_code != 200:
            return 50
    except:
        return 50
    return int(response.text)

@app.route('/compare/<st1>/<st2>',methods=['GET'])
def get_pred(st1,st2):
    return jsonify({'answer':predictCorrect(st1,st2)})


"""
This method is used to init default values like tags item id ...
"""
def init_db():
    #set the id of the tag list
    count = tagsCollection.count_documents({}) 
    global tags_item_id
    if count == 0:
        tag = tagsCollection.insert_one({'tags':[]})
        tags_item_id = str(tag.inserted_id)
    else:
        tag = tagsCollection.find_one({})
        tags_item_id = str(tag['_id'])
    #add the "wie gefällt die ALIAS" question
    count = cardsCollection.count_documents({'created_by':'Admin'})
    global alias_question_id
    if count == 0:
        #create data Type of the question
        dataInsert={}
        dataInsert['created_by']="Admin"
        dataInsert['question']="Wie gefällt die ALIAS?"
        dataInsert['answer']="gut"
        dataInsert['tags']=[]
        #fields which are filled at Creation-Time
        dataInsert['created']=datetime.utcnow()
        dataInsert['createdSemester']=get_current_Semester()
        dataInsert['version']=1
        dataInsert['latest']=True
        #insert into db and save the id
        card = cardsCollection.insert_one(dataInsert)
        alias_question_id = str(card.inserted_id)
    else:
        card = cardsCollection.find_one({'created_by':'Admin'})
        alias_question_id = str(card['_id'])


if __name__ == "__main__":
    init_db()
    #If runs in docker compose, use:
    #It's a waitress prod server
    serve(app,host="0.0.0.0",port=5000)
    
    #If DB runs from Python script (flask dev server), use: 
    #app.run(port=5000)
