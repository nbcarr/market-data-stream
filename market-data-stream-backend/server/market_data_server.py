import logging
from queue import Queue

from config import DEFAULT_TICKER
from server.websocket_handler import MarketDataWebSocket
from services.polygon_service import PolygonService

logger = logging.getLogger(__name__)


class MarketDataServer:
    """Manages market data streaming and API requests"""

    def __init__(self, use_fake_data=False):
        """
        use_fake_data: Whether to use fake data, for testing when the market is clsoed
        """
        self.message_queue = Queue()
        self.current_symbol = DEFAULT_TICKER
        self.use_fake_data = use_fake_data
        self.web_socket = MarketDataWebSocket(self)
        self.polygon_service = PolygonService()

    async def get_initial_data(self):
        """
        Get initial data (news and financials)
        """
        financials = self.polygon_service.get_company_financials(self.current_symbol)
        news = self.polygon_service.get_ticker_news(self.current_symbol)
        return financials, news

    async def handle_symbol_update(self, new_symbol):
        """
        Handle symbol update request
        """
        self.current_symbol = new_symbol
        logger.info(f"Updating symbol to: {new_symbol}")
        return await self.get_initial_data()

    def get_market_data(self):
        """
        Get market data either from queue (Polygon websocket) or fake generated data
        """
        if self.use_fake_data:
            return self.web_socket.generate_market_data(self.current_symbol)

        if not self.message_queue.empty():
            return self.message_queue.get()

        assert False, "MarketDataServer.get_market_data(): Should be unreachable"

    def start(self):
        """Start the server"""
        self.web_socket.start_worker()
