from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import date,datetime,timedelta

#import correctness.py from same folder
from correctness import compare

app = Flask(__name__)
CORS(app)

#Configs for MongoDB Connection
app.config['MONGO_DBNAME']='projekt'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/prototyp1'
mongo = PyMongo(app)

#Initialise collection classes to query and add data for the collections
cardsCollection = mongo.db.cards
answersCollection = mongo.db.answers
usersCollection = mongo.db.users

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
    for card in cardsCollection.find({"tags":{"$all":[str(tag) for tag in tags]}}):
        card['_id']=str(card['_id'])
        output.append(card)
    return jsonify({'cards':output})


#Create a new card
#Data gets provided via JSON in the request
@app.route('/cards', methods=['POST'])
def create_card():
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
        dataInsert['answer_count']=0
    except:
        return jsonify({'error':'Payload does not contain all necessary fields'}),400
    #Insert card and return id
    card = cardsCollection.insert_one(dataInsert)
    return jsonify({'Message':'Card "{0}" was created with id {1}'.format(dataInsert['question'],str(card.inserted_id))})


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
        print("Search for tags")
        card = cardsCollection.aggregate([
            {"$sample":{'size':1}},
            {"$match":{"tags":{"$all":[str(tag) for tag in tags]}}},
            {"$match":{'latest':True}}])
    else:
        print("No Tags")
        card = cardsCollection.aggregate([
            {"$sample":{"size":1}},
            {"$match":{'latest':True}}])
    output={}
    for c in card:
        if c is None:
            return jsonify({'error':"There is no question available"}),400 
        output['cardId']=str(c['_id'])
        output['question']=c['question']
        output['answer']=c['answer']
    return jsonify(output)

   
#Create a new answer and get an automatic evaluation
@app.route('/answer',methods=['POST'])
def create_new_answer_and_get_result():
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    print(dataRequest)
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
        dataInsert['predictedCorrectness']=compare(dataInsert['userAnswer'],dataInsert['correctAnswer'])
        dataInsert['cardLatest']=True
        dataInsert['userCorrectness']=[]
        dataInsert['averageCorrectness']=dataInsert['predictedCorrectness']
    except:
        return jsonify({'error':'Payload does not contain all necessary fields'}),400
    #Insert card and return id
    answer = answersCollection.insert_one(dataInsert)
    return jsonify({'Message':'Answer "{0}" was created with id {1}'.format(dataInsert['userAnswer'],str(answer.inserted_id)),
    'predictedCorrectness':str(dataInsert['predictedCorrectness'])})


#Get an answer to let the user validate
@app.route('/answer/validate')
def get_answer_to_validate():
    answer = answersCollection.aggregate([
        {"$sample":{"size":1}},
        {"$match":{'cardLatest':True}}])
    output = {}
    for a in answer:
        if a is None:
            return jsonify({'error':"There is no answer available"}),400
        card = cardsCollection.find_one({'_id':ObjectId(a['cardId'])})
        output['question']=card['question']
        output['correctAnswer']=card['answer']
        output['userAnswer']=a['userAnswer']
    return jsonify(output)
    

"""
Methods for Saving user filter for Topics
"""

#get all user filters
@app.route('/users/<email>/filters',methods=['GET'])
def get_filters_for_user(email):
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
    #get json data from request
    dataRequest = {}
    try:
        dataRequest = request.get_json(force=True)
        if not dataRequest['email'] or not dataRequest['filter']:
            return jsonify({'error':'Request does not contain all needed data'}),400
    except :
        return jsonify({'error':'Payload is not a valid json object'}),400
    print(dataRequest)
    #check if user already has some filters
    if usersCollection.find_one({"email":dataRequest['email']}) is not None:
        try:
            usersCollection.update_one({"email":dataRequest['email']},{"$push":{'filter':list(dataRequest['filter'])}})
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


"""
Methods for getting learning advance for user 
"""

#Get number of card in period with correctness over 50
@app.route('/users/<email>/progress',methods = ['GET'])   
def get_progress_for_user(email):
    #get given timeperiod
    try:
        day = int(request.args['days'])
    except:
        day = 1
    #get relevant period
    startTime = datetime.utcnow() - timedelta(days=day)
    #get data for user
    count_overall = 0
    count_correct = 0
    for answer in answersCollection.find({'created_by': {'$gte': startTime}}):
        count_overall += 1
        if answer['averageCorrectness'] >= 50:
            count_correct += 1
    return jsonify({'cardsCorrect':count_correct,'cardsOverall':count_overall})


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


"""
Route to test the correctness module
"""
@app.route('/compare/<str1>/<str2>',methods=['GET'])
def compare_strings(str1,str2):
    return jsonify({'result':compare(str1,str2)})

if __name__ == "__main__":
    app.run(debug=True)