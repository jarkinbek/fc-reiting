import pymysql
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

# Загрузка модели
model = joblib.load('model.pkl')

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Подключение к базе данных
db = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='football',
    cursorclass=pymysql.cursors.DictCursor
)

# Роут для предсказания рейтинга
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    input_df = pd.DataFrame([{
        'age': data['age'],
        'pace': data['pace'],
        'shooting': data['shooting'],
        'passing': data['passing'],
        'dribbling': data['dribbling'],
        'defending': data['defending'],
        'physicality': data['physicality'],
        'height': data['height'],
        'weight': data['weight'],
        'tackles': data['tackles'],
        'interceptions': data['interceptions'],
        'vision': data['vision'],
        'ball_control': data['ball_control'],
        'reactions': data['reactions'],
        'stamina': data['stamina'],
        'aggression': data['aggression'],
        'balance': data['balance'],
        'composure': data['composure'],
    }])

    print("Данные для предсказания:", input_df)

    try:
        predicted_rating = model.predict(input_df)[0]
        print("Предсказанный рейтинг:", predicted_rating)
        return jsonify({'rating': round(predicted_rating, 2)})
    except Exception as e:
        print("❌ Ошибка при предсказании:", e)
        return jsonify({'error': 'Ошибка модели'}), 500

# Роут для добавления игрока в базу данных
@app.route('/api/add-player', methods=['POST'])
def add_player():
    data = request.get_json()

    name = data.get('name')
    age = data.get('age')
    pace = data.get('pace')
    shooting = data.get('shooting')
    passing = data.get('passing')
    dribbling = data.get('dribbling')
    defending = data.get('defending')
    physicality = data.get('physicality')
    height = data.get('height')
    weight = data.get('weight')
    tackles = data.get('tackles')
    interceptions = data.get('interceptions')
    vision = data.get('vision')
    ball_control = data.get('ball_control')
    reactions = data.get('reactions')
    stamina = data.get('stamina')
    aggression = data.get('aggression')
    balance = data.get('balance')
    composure = data.get('composure')
    overall = float(data.get('overall'))
    photo_url = data.get('photo_url')  # Новый параметр

    try:
        with db.cursor() as cursor:
            sql = """
                INSERT INTO players (
                    name, age, pace, shooting, passing, dribbling, defending, physicality,
                    height, weight, tackles, interceptions, vision, ball_control,
                    reactions, stamina, aggression, balance, composure, overall, photo_url
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s
                )
            """
            cursor.execute(sql, (
                name, age, pace, shooting, passing, dribbling, defending, physicality,
                height, weight, tackles, interceptions, vision, ball_control,
                reactions, stamina, aggression, balance, composure, overall, photo_url
            ))
            db.commit()

        return jsonify({'message': 'Игрок успешно добавлен!'}), 200

    except Exception as e:
        print("❌ Ошибка при добавлении игрока:", e)
        return jsonify({'error': 'Ошибка при добавлении игрока в базу данных'}), 500

# Запуск сервера
if __name__ == '__main__':
    app.run(port=5000)
