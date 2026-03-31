# Price Pulse

A full-stack price tracking and prediction web application built with a three-tier architecture: a JavaScript frontend, a Node.js backend API, and a Python-based machine learning service. Price Pulse allows users to monitor product or asset prices over time and leverages an ML model to forecast future price trends.

---

## Table of Contents

- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Directory Structure](#directory-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Services](#running-the-services)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [ML Service](#ml-service)
- [Frontend](#frontend)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Price Pulse is designed to help users track price changes for products or financial assets and receive data-driven predictions about future prices. The application is split into three independently runnable services that communicate over HTTP:

- The **frontend** provides the user interface for searching, viewing, and interacting with price data.
- The **backend** serves as the central API layer, handling data ingestion, storage, authentication, and orchestration between the frontend and ML service.
- The **ml-service** is a Python microservice that exposes a prediction endpoint, running a trained regression or time-series model to forecast price trends based on historical data.

---

## Project Architecture

```
                        +-------------------+
                        |                   |
                        |     Frontend      |
                        |  (JavaScript/CSS) |
                        |                   |
                        +--------+----------+
                                 |
                         HTTP REST API
                                 |
                        +--------v----------+
                        |                   |
                        |     Backend       |
                        |   (Node.js/       |
                        |    Express)       |
                        |                   |
                        +----+----------+---+
                             |          |
               REST API      |          |   Database
                             |          |
               +-------------+          +------------------+
               |                                           |
    +----------v----------+                    +-----------v--------+
    |                     |                    |                    |
    |    ML Service       |                    |     Database       |
    |    (Python/Flask    |                    |   (MongoDB or      |
    |     or FastAPI)     |                    |    PostgreSQL)     |
    |                     |                    |                    |
    +---------------------+                    +--------------------+
```

### Architecture Description

**Frontend** communicates exclusively with the **Backend** via a RESTful API. It never calls the ML service directly. This separation of concerns keeps the user-facing layer clean and stateless.

**Backend** acts as the application server and API gateway. It:
- Receives requests from the frontend.
- Reads and writes price data to the database.
- Delegates prediction requests to the ML service.
- Returns aggregated responses back to the frontend.

**ML Service** is a lightweight Python microservice that:
- Receives historical price data from the backend.
- Runs a trained model (e.g., Linear Regression, ARIMA, or LSTM) to generate forecasts.
- Returns prediction results as JSON to the backend.

This architecture allows each service to be developed, deployed, and scaled independently.

---

## Directory Structure

```
price_pulse/
├── backend/                  # Node.js Express API server
│   ├── controllers/          # Route handler logic
│   ├── models/               # Database schemas and models
│   ├── routes/               # API route definitions
│   ├── middleware/           # Auth, validation, error handling
│   ├── config/               # DB connection and environment config
│   ├── package.json          # Node.js dependencies and scripts
│   └── server.js             # Entry point for the backend server
│
├── frontend/                 # Client-side web application
│   ├── public/               # Static assets (HTML, icons)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level views
│   │   ├── services/         # API call utilities
│   │   └── styles/           # CSS stylesheets
│   └── package.json          # Frontend dependencies and scripts
│
├── ml-service/               # Python machine learning microservice
│   ├── model/                # Trained model files and training scripts
│   ├── app.py                # Flask/FastAPI entry point
│   ├── predictor.py          # Prediction logic
│   └── requirements.txt      # Python dependencies
│
└── .gitignore
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| JavaScript (ES6+) | Core application logic |
| HTML5 | Markup and structure |
| CSS3 | Styling and layout |
| React (or Vanilla JS) | UI rendering and component management |
| Fetch / Axios | HTTP requests to the backend API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and routing |
| Mongoose / pg | Database ORM/driver |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

### ML Service
| Technology | Purpose |
|---|---|
| Python 3.x | Core runtime |
| Flask or FastAPI | HTTP microservice framework |
| scikit-learn / statsmodels | Machine learning and forecasting models |
| pandas / numpy | Data processing |
| joblib | Model serialization |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB or PostgreSQL | Persistent data storage |
| npm | Package management (frontend and backend) |
| pip | Package management (ML service) |

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system before proceeding:

- Node.js v16 or higher
- npm v8 or higher
- Python 3.8 or higher
- pip
- MongoDB (local instance or Atlas connection URI) or PostgreSQL

### Installation

Clone the repository:

```bash
git clone https://github.com/Abhishek4july/price_pulse.git
cd price_pulse
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Install ML service dependencies:

```bash
cd ../ml-service
pip install -r requirements.txt
```

### Running the Services

Each service must be started separately. Open three terminal windows or use a process manager like `concurrently` or `pm2`.

**Start the Backend:**

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000` by default.

**Start the Frontend:**

```bash
cd frontend
npm start
```

The frontend development server will start on `http://localhost:3000` by default.

**Start the ML Service:**

```bash
cd ml-service
python app.py
```

The ML microservice will start on `http://localhost:8000` by default.

---

## Environment Variables

Each service requires its own environment configuration. Create `.env` files in each service directory based on the examples below.

**backend/.env**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/price_pulse
ML_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**frontend/.env**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**ml-service/.env** (if applicable)

```env
PORT=8000
MODEL_PATH=./model/price_model.pkl
```

---

## API Reference

All backend routes are prefixed with `/api`.

### Price Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/prices` | Retrieve all tracked prices |
| GET | `/api/prices/:id` | Get price history for a specific item |
| POST | `/api/prices` | Add a new price entry |
| DELETE | `/api/prices/:id` | Remove a tracked item |

### Prediction Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/predict` | Request a price forecast for a given item |

### Auth Endpoints (if applicable)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and receive a JWT token |

---

## ML Service

The ML service exposes a single prediction endpoint that the backend calls internally.

**Endpoint:** `POST /predict`

**Request body:**

```json
{
  "item_id": "string",
  "history": [
    { "date": "2024-01-01", "price": 120.5 },
    { "date": "2024-01-02", "price": 121.0 }
  ]
}
```

**Response:**

```json
{
  "item_id": "string",
  "predicted_price": 123.4,
  "confidence": 0.87,
  "forecast_date": "2024-01-10"
}
```

The model is trained offline and serialized using `joblib`. The `predictor.py` module loads the model at startup and runs inference on each request.

---

## Frontend

The frontend presents a dashboard with the following features:

- Search and browse tracked items or assets.
- View historical price charts with interactive timelines.
- Request and display ML-driven price predictions.
- User authentication (login and registration flow, if implemented).

The frontend communicates with the backend API using `fetch` or `axios` calls, with the base URL configured through environment variables.

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against the `main` branch.

Please ensure your code follows existing conventions and that any new dependencies are reflected in the appropriate `package.json` or `requirements.txt`.

---

## License

This project does not currently specify a license. All rights are reserved by the author unless otherwise stated. Contact the repository owner for usage permissions.

---

**Repository:** [https://github.com/Abhishek4july/price_pulse](https://github.com/Abhishek4july/price_pulse)
