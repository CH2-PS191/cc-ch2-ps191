from flask import Flask, request, jsonify
import tensorflow
import sklearn
from tensorflow.keras.preprocessing.sequence import pad_sequences
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.models import load_model
import pickle,json
import numpy as np
import pandas as pd

app = Flask(__name__)

with open('respon.json', 'r') as f:
    respon = json.load(f)
data_respon = []
for example in respon:
  temp_tag = example['tag']
  temp_respon = []
  for respons in example['responses']:
    temp_respon.append(respons)
  temp=[temp_tag,temp_respon]
  data_respon.append(temp)
data_respon = pd.DataFrame(data_respon,columns=['tag','responses'])

with open('tokenizer.pkl','rb') as handle:
    tokenizer = pickle.load(handle)
model = load_model('model.h5')
with open('lbl_enc.pkl', 'rb') as label_encoder_file:
    label_encoder = pickle.load(label_encoder_file)



@app.route('/predict',methods=['POST'])
def predict():
    data = request.get_json()
    input_text = data['input_text']
    input_sequence = tokenizer.texts_to_sequences([input_text])
    padded_sequence = pad_sequences(input_sequence, maxlen=115, padding='post')
    predicted_probabilities = model.predict(padded_sequence)
    predicted_index = np.argmax(predicted_probabilities)
    predicted_tag = label_encoder.inverse_transform([predicted_index])[0]
    respons = data_respon[data_respon['tag']==predicted_tag]['responses'].values[0][0]
    return jsonify({'answer': respons})

if __name__ == '__main__':
    app.run(debug=True)