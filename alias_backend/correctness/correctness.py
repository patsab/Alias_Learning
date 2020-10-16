import spacy
from flask import Flask, jsonify, request
from waitress import serve


app = Flask(__name__)
app.config.from_pyfile('correctness_config_dev.cfg')


#load the pretrained language pack
nlpNews = spacy.load('de_core_news_lg')
nlpBert = spacy.load('de_trf_bertbasecased_lg')

#stop words are words without relevant meaning, but still there are some words which are usefull
#These words will be removed from the stop word list, because they sould not be filteres out in the strings


#def a list of synonyms, which should be replaces
#the lemma of the synonyms will be used, so grammatically it could be wrong
#e.g. "hoch kosten" is not correct 
synonyms={
    "teuer":"kosten"
}

#comparison with 'de_core_news_lg'
def compareNews(a_str, b_str):
    try:
        a = nlpNews(process_text(a_str,nlpNews))
        b = nlpNews(process_text(b_str,nlpNews))
        return int(round(a.similarity(b)*100))
    except:
        return 50

def compareBert(a_str,b_str):
    try:
        a = nlpBert(process_text(a_str,nlpBert))
        b = nlpBert(process_text(b_str,nlpBert))
        return int(round(a.similarity(b)*100))
    except:
        return 50

#prepare the text for comparison
def process_text(text,nlp):
    doc = nlp(text)
    result = []
    for token in doc:
        #replace with synonym
        if token.text in synonyms:
            result.append(synonyms[token.text])
            continue
        #remove stop words
        if token.is_stop:
            continue
        #remove pronouns
        if token.pos_ == 'PRON':
            continue
        result.append(token.lemma_)
    return " ".join(result)

#This route gets 2 Strings ans compares them
#it will be used by the backend: app.py
@app.route('/compare',methods=['GET'])
def compare_strings():
    #get the data from the request
    try:
        userAnswer = request.args['userAnswer']
        correctAnswer = request.args['correctAnswer']
    except:
        return jsonify({'error':'No strings to compare were provided'}),400
    answer = {}
    answer['bertbased']=compareBert(userAnswer,correctAnswer)
    answer['news']=compareNews(userAnswer,correctAnswer)
    print(answer)
    return answer
    

if __name__ == "__main__":
    serve(app,host="0.0.0.0",port=5010)
    #app.run(port=5010)
