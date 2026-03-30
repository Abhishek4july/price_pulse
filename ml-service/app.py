from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    prices = data.get('priceHistory', [])
    competitor_prices = data.get('competitorPrices', [])

    if not prices:
        return jsonify({
            "error": "No historical data available"
        }), 400

    if len(prices) < 2:
        avg_competitor = np.mean(competitor_prices) if competitor_prices else prices[0]

        demand_score = min(prices[0] / (avg_competitor + 1), 1.0)

        return jsonify({
            "predictedPrice": round(float(np.mean(prices)), 2),
            "predictedDemand": round(float(demand_score), 2),
            "message": "Prediction based on limited data"
        }), 200

    X = np.array(range(len(prices))).reshape(-1, 1)
    y = np.array(prices)

    model = LinearRegression()
    model.fit(X, y)

    next_time = np.array([[len(prices)]])
    predicted_price = model.predict(next_time)[0]

    avg_competitor = np.mean(competitor_prices) if competitor_prices else predicted_price

    demand_score = min(predicted_price / (avg_competitor + 1), 1.0)

    return jsonify({
        "predictedPrice": round(float(predicted_price), 2),
        "predictedDemand": round(float(demand_score), 2)
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)