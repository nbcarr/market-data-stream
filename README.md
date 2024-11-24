# Real-Time Market Data Dashboard

A full-stack application that provides real-time market data visualization, financial information, and news updates from the [Polygon](https://polygon.io/) API.

Built with FastAPI/Python and JavaScript/React, it features WebSocket streaming for live market data and a responsive, interactive UI.



https://github.com/user-attachments/assets/c1e8c952-c6f5-4070-ae09-678295d01934



## Features

- Real-time market data streaming
- Interactive price charts
- Financial metrics display
- Live news feed with sentiment analysis
- Symbol search and switching
- WebSocket connection management
- Support for both live and simulated data

## Stack

### Backend
- Python
- FastAPI
- [Polygon.io](https://polygon.io/docs/) API (REST and WebSocket endpoints)

### Frontend
- React
- [Recharts](https://recharts.org/en-US/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Setup

### Backend
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip3 install -r requirements.txt

# Run the server
python3 main.py
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Config
Set up a `config.py` file and set/update the following fields as needed:
```python
API_KEY = <Polygon API Key>
DEFAULT_TICKER = "AMZN"
POLYGON_WS_URL = "wss://delayed.polygon.io/stocks"
POLYGON_REST_URL = "https://api.polygon.io/v2"
POLYGON_FINANCIALS_URL = "https://api.polygon.io/vX"
USE_FAKE_DATA = True # use simulated market data instead of live API data
HOST = "127.0.0.1"
PORT = 8000
```
