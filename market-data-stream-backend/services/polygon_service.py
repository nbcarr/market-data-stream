import requests
import logging
from config import API_KEY, POLYGON_REST_URL, POLYGON_FINANCIALS_URL

logger = logging.getLogger(__name__)

class PolygonService:
    """
    Handles all Polygon REST interactions
    
    See: https://polygon.io/docs/stocks
    """
    
    @staticmethod
    def get_company_financials(ticker, limit=1):
        """
        Fetch company financial data, by default only from the latest quarter
        
        See: https://polygon.io/docs/stocks/get_vx_reference_financials
        """
        url = f"{POLYGON_FINANCIALS_URL}/reference/financials"
        params = {
            "ticker": ticker,
            "apiKey": API_KEY,
            "limit": limit,
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data["status"] == "OK":
                financials = data["results"][0]["financials"]
                return {
                    "type": "financials_update",
                    "symbol": ticker,
                    "financials": {
                        "earnings_per_share": financials["income_statement"]["basic_earnings_per_share"]["value"],
                        "assets": financials["balance_sheet"]["assets"]["value"],
                        "equity": financials["balance_sheet"]["equity"]["value"],
                        "revenue": financials["income_statement"]["revenues"]["value"],
                        "net_income": financials["income_statement"]["net_income_loss"]["value"],
                        "operating_income": financials["income_statement"]["operating_income_loss"]["value"],
                    },
                }
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching financials: {e}")
            return []

    @staticmethod
    def get_ticker_news(ticker, limit=10):
        """
        Fetch news articles for a given ticker
        
        See: https://polygon.io/docs/stocks/get_v2_reference_news
        """
        url = f"{POLYGON_REST_URL}/reference/news"
        params = {"ticker": ticker, "limit": limit, "apiKey": API_KEY}

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            if data["status"] == "OK":
                return {
                    "type": "news_update",
                    "symbol": ticker,
                    "articles": [
                        {
                            "title": article["title"],
                            "description": article["description"],
                            "url": article["article_url"],
                            "published_utc": article["published_utc"],
                            "sentiment": article["insights"][0]["sentiment"] if article.get("insights") else "neutral",
                        }
                        for article in data["results"]
                    ],
                }
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching news: {e}")
            return []

    @DeprecationWarning
    @staticmethod
    def get_historical_bars(ticker, minutes=15):
        """
        Fetch historical price bars for a given ticker
        
        !!! Currently not being used !!!
        There's a 15 minute delay in the data for the REST endpoint, but the websocket is realtime, so they aren't usable together
        Just leaving this here in case I ever upgrade the subscription
        
        See: https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
        """
        import time
        end_time = int(time.time() * 1000) - (15 * 60 * 1000)  # 15 min delay
        start_time = end_time - (minutes * 60 * 1000)

        url = f"{POLYGON_REST_URL}/aggs/ticker/{ticker}/range/1/minute/{start_time}/{end_time}"
        params = {
            "adjusted": "true",
            "sort": "asc",
            "limit": minutes * 60,
            "apiKey": API_KEY,
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            if data["status"] in ["OK", "DELAYED"]:
                return {
                    "type": "historical_data",
                    "symbol": ticker,
                    "bars": data.get("results", [])
                }
            return {
                "type": "historical_error",
                "symbol": ticker,
                "error": data.get("status")
            }
        except requests.exceptions.RequestException as e:
            return {"type": "historical_error", "symbol": ticker, "error": str(e)}