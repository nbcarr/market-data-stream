import json
import logging
import random
import threading
import time

import websocket
from config import API_KEY, POLYGON_WS_URL

logger = logging.getLogger(__name__)


class MarketDataWebSocket:
    """
    Handles WebSocket connection to Polygon

    See: https://polygon.io/docs/stocks/ws_stocks_a
    """

    def __init__(self, server):
        self.server = server
        self.ws = websocket.WebSocketApp(
            POLYGON_WS_URL,
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
            on_open=self.on_open,
        )
        self.worker = threading.Thread(target=self.start)
        self.worker.daemon = True

    def on_message(self, ws, message):
        data = json.loads(message)
        for stock in data:
            if "sym" in stock and stock["sym"] == self.server.current_symbol:
                self.server.message_queue.put(json.dumps(stock))

    def on_error(self, ws, error):
        logger.error(f"WebSocket error: {error}")

    def on_close(self, ws, close_status_code=None, close_msg=None):
        logger.info("WebSocket connection closed")

    def on_open(self, ws):
        logger.info("WebSocket connected")
        auth_data = {"action": "auth", "params": API_KEY}
        self.ws.send(json.dumps(auth_data))
        subscribe_data = {"action": "subscribe", "params": "A.*"}
        self.ws.send(json.dumps(subscribe_data))
        logger.info("Subscribed to market data stream")

    def start_worker(self):
        self.worker.start()

    def start(self):
        self.ws.run_forever()

    @staticmethod
    def generate_market_data(symbol, base_price=None):
        """
        Generate fake market data point, used for testing when market is closed
        """
        if base_price is None:
            base_price = 120.0

        variation = random.uniform(0.995, 1.005)
        price = base_price * variation

        return {
            "ev": "AM",
            "sym": symbol,
            "v": random.randint(100, 1000),
            "av": random.randint(10000, 100000),
            "op": f"${price:,.2f}",
            "vw": f"{price * random.uniform(0.999, 1.001):,.2f}",
            "o": f"{price * random.uniform(0.999, 1.001):,.2f}",
            "c": f"{price:,.2f}",
            "h": f"{price * random.uniform(1.001, 1.002):,.2f}",
            "l": f"{price * random.uniform(0.998, 0.999):,.2f}",
            "a": f"{price * random.uniform(0.999, 1.001):,.2f}",
            "z": random.randint(100, 1000),
            "s": int(time.time() * 1000),
            "e": int(time.time() * 1000) + 60000,
        }
