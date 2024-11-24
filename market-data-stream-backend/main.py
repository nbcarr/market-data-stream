import asyncio
import json
import logging

from config import HOST, PORT, USE_FAKE_DATA
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from server.market_data_server import MarketDataServer

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server = MarketDataServer(use_fake_data=USE_FAKE_DATA)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time market data via Polygon
    """
    await websocket.accept()
    logger.info("Client connected")

    try:
        financials, news = await server.get_initial_data()
        await websocket.send_json(financials)
        await websocket.send_json(news)

        while True:
            try:
                # Check for client messages and handle new symbol updates
                data = await asyncio.wait_for(websocket.receive_json(), timeout=0.1)

                if data.get("action") == "update_symbol":
                    financials, news = await server.handle_symbol_update(
                        data.get("symbol")
                    )
                    await websocket.send_json(financials)
                    await websocket.send_json(news)

            except asyncio.TimeoutError:  # nothing received
                pass

            market_data = server.get_market_data()
            if market_data:
                if isinstance(market_data, str):
                    market_data = json.loads(market_data)
                market_data["type"] = "market_update"
                await websocket.send_json(market_data)

            await asyncio.sleep(0.1)

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        logger.info("Client disconnected")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)
