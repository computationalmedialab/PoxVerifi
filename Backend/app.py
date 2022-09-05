from flask import Flask
from flask import request, jsonify
app = Flask(__name__)
import fuzzywuzzy
from fuzzywuzzy import fuzz
from flask_cors import CORS
from newspaper import Article # https://newspaper.readthedocs.io/en/latest/
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import cross_val_score
import torch
import transformers as ppb
import warnings

import requests
from bs4 import BeautifulSoup
 


warnings.filterwarnings('ignore')
import pickle
loaded_model = pickle.load(open('bert_monkeypox.sav', 'rb'))




CORS(app)



claims = []
with open('all-claims.txt') as f:
    lines = f.readlines()
    for i in range(0,len(lines),2):
        claims.append({"claim": lines[i][0:-1], "rating": lines[i+1][0:-1]})

        

@app.route('/matches', methods=['GET'])
def method1():
    text = request.args.get('text', default = "", type = str)
    matches = []
    for claim in claims:
        if (fuzz.ratio(claim['claim'].lower(), text.lower()) > 40):
            claim['similarity'] = fuzz.ratio(claim['claim'].lower(), text.lower())
            matches.append(claim)
    matches = sorted(matches, key=lambda x: x['similarity'], reverse=True)
    return jsonify(matches)

@app.route('/classify', methods=['GET'])
def method2():
    text = request.args.get('text', default = "", type = str)
    results = {"Model1": "96.1%", "Model2": "98.37%"}
    return jsonify(results)

@app.route('/headline', methods=['GET'])
def method3():
    url = request.args.get('url', default = "", type = str)
    try:
        article = Article(url)
        article.download()
        article.parse()
        authors = article.authors
        signature = ""
        if(len(authors)== 1):
            signature = "by " + authors[0]
        elif(len(authors)== 2):
            signature = "by " + authors[0] + " and " + authors[1]
        else:
            signature = "by " + authors[0] + " et al."
        ret = {"signature": signature, "title": article.title}
        return jsonify(ret)
    except:
        reqs = requests.get(url)
 
        # using the BeautifulSoup module
        soup = BeautifulSoup(reqs.text, 'html.parser')
        
        # displaying the title
        ret = {"signature": "", "title": ""}
        for title in soup.find_all('title')[0:1]:
            ret["title"] = title.get_text()
        return jsonify(ret)

@app.route('/ml', methods=['GET'])
def method4():
    claim = request.args.get('claim', default = "", type = str)
    data  = [claim]
    df = pd.DataFrame(data)
    sentence = df[0]
    # For DistilBERT:
    model_class, tokenizer_class, pretrained_weights = (ppb.DistilBertModel, ppb.DistilBertTokenizer, 'distilbert-base-uncased')
    ## Want BERT instead of distilBERT? Uncomment the following line:
    #model_class, tokenizer_class, pretrained_weights = (ppb.BertModel, ppb.BertTokenizer, 'bert-base-uncased')

    # Load pretrained model/tokenizer
    tokenizer = tokenizer_class.from_pretrained(pretrained_weights)
    model = model_class.from_pretrained(pretrained_weights)

    tokenized = sentence.apply((lambda x: tokenizer.encode(x, add_special_tokens=True)))
    max_len = 0
    for i in tokenized.values:
        if len(i) > max_len:
            max_len = len(i)

    padded = np.array([i + [0]*(max_len-len(i)) for i in tokenized.values])
    attention_mask = np.where(padded != 0, 1, 0)
    attention_mask.shape
    input_ids = torch.tensor(padded)  
    attention_mask = torch.tensor(attention_mask)

    with torch.no_grad():
        last_hidden_states = model(input_ids, attention_mask=attention_mask)
    features = last_hidden_states[0][:,0,:].numpy()
    result = loaded_model.predict(features)
    return (result[0])   





@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response



app.run()