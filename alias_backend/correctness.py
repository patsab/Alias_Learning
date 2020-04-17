import spacy

#load the pretrained language pack
nlp = spacy.load('de_core_news_md')
nlp2 = spacy.load('de_trf_bertbasecased_lg')

#stop words are words without relevant meaning, but still there are some words which are usefull
#These words will be removed from the stop word list, because they sould not be filteres out in the strings


#def a list of synonyms, which should be replaces
#the lemma of the synonyms will be used, so grammatically it could be wrong
#e.g. "hoch kosten" is not correct 
synonyms={
    "teuer":"kosten"
}

#compare 2 strings with the core_language pack
def compare(a_str, b_str):
    try:
        a_processed = process_text(a_str)
        b_processed = process_text(b_str)
        #comparison with 'de_core_news_md'
        a = nlp(a_processed)
        b = nlp(b_processed)
        res1 = int(round(a.similarity(b)*100))
        #comparison with 'de_trf_bertbasecased_lg'
        a = nlp2(a_processed)
        b = nlp2(b_processed)
        res2 = int(round(a.similarity(b)*100))
        #return the greater value of the 2 results
        return max(res1,res2)
    except:
        return 50

#prepare the text for comparison 
def process_text(text):
    doc = nlp(text.lower())
    result = []
    for token in doc:
        #replace with synonym
        if token.text in synonyms:
            result.append(synonyms[token.text])
            continue
        #print(token.text,token.lemma_,token.pos_,token.shape_, token.is_stop)
        #remove stop words
        if token.text in nlp.Defaults.stop_words:
            continue
        #remove pronouns
        if token.pos_ == '-PRON-':
            continue
        result.append(token.lemma_)
    return " ".join(result)