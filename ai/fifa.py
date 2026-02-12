import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree
import pickle

df = pd.read_csv("FIFA-2019.csv")

df_model = df[[
    'ID', 'Name', 'Age', 'Nationality', 'Club', 'Overall',
    'SprintSpeed', 'Finishing', 'ShortPassing', 'Dribbling',
    'Marking', 'Strength', 'Height', 'Weight', 'StandingTackle',
    'Interceptions', 'Vision', 'BallControl', 'Reactions',
    'Stamina', 'Aggression', 'Balance', 'Composure'
]].copy()

df_model.columns = [
    'id', 'name', 'age', 'nationality', 'club', 'rating',
    'pace', 'shooting', 'passing', 'dribbling', 'defending',
    'physicality', 'height', 'weight', 'tackles', 'interceptions',
    'vision', 'ball_control', 'reactions', 'stamina', 'aggression',
    'balance', 'composure'
]

def height_to_cm(h):
    try:
        feet, inches = h.split("'")
        return round((int(feet) * 12 + int(inches)) * 2.54)
    except:
        return np.nan

def weight_to_kg(w):
    try:
        return round(int(w.replace('lbs', '')) * 0.453592)
    except:
        return np.nan

df_model['height'] = df_model['height'].apply(height_to_cm)
df_model['weight'] = df_model['weight'].apply(weight_to_kg)
df_model.dropna(inplace=True)

features = [
    'age', 'pace', 'shooting', 'passing', 'dribbling',
    'defending', 'physicality', 'height', 'weight',
    'tackles', 'interceptions', 'vision', 'ball_control',
    'reactions', 'stamina', 'aggression', 'balance', 'composure'
]

X = df_model[features]
y = df_model['rating']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")

estimator = model.estimators_[0]
plt.figure(figsize=(20, 10))
plot_tree(estimator,
          feature_names=X.columns,
          filled=True,
          rounded=True,
          max_depth=3)
plt.show()

print("\nВведите характеристики игрока:")
user_input = {
    'age': int(input("Возраст: ")),
    'pace': float(input("Скорость: ")),
    'shooting': float(input("Удары: ")),
    'passing': float(input("Пасы: ")),
    'dribbling': float(input("Дриблинг: ")),
    'defending': float(input("Оборона: ")),
    'physicality': float(input("Физика: ")),
    'height': int(input("Рост (в сантиметрах): ")),
    'weight': int(input("Вес (в килограммах): ")),
    'tackles': float(input("Подкаты: ")),
    'interceptions': float(input("Перехваты: ")),
    'vision': float(input("Видение поля: ")),
    'ball_control': float(input("Контроль мяча: ")),
    'reactions': float(input("Реакции: ")),
    'stamina': float(input("Выносливость: ")),
    'aggression': float(input("Агрессия: ")),
    'balance': float(input("Баланс: ")),
    'composure': float(input("Хладнокровие: "))
}

input_df = pd.DataFrame([user_input])
predicted_rating = model.predict(input_df)[0]
print(f"\nПредсказанный рейтинг игрока: {round(predicted_rating, 2)}")

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Модель сохранена в model.pkl!")
