import { useState, useEffect, useRef } from "react";
import MarketData from "./components/MarketData";
import Charts from "./components/Charts";
import Financials from "./components/Financials";
import News from "./components/News";
import Configuration from "./components/Configuration";
import LoadingMessage from "./components/LoadingMessage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSymbolChanging, setIsSymbolChanging] = useState(false);
  const [marketData, setMarketData] = useState({});
  const [newsData, setNewsData] = useState({ articles: [] });
  const [financialsData, setFinancialsData] = useState({ financials: {} });
  const [priceHistory, setPriceHistory] = useState([{}]);
  const wsRef = useRef(null);

  function onConfigurationSubmit(formJson) {
    setIsSymbolChanging(true);
    setMarketData({});
    setNewsData({ articles: [] });
    setFinancialsData({ financials: {} });
    setPriceHistory([{}]);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "update_symbol",
          symbol: formJson.symbol,
        })
      );
    } else {
      console.log("WebSocket is not connected");
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "historical_data":
          setPriceHistory(
            data.bars.map((bar) => ({
              time: new Date(bar.t * 1000).toLocaleTimeString(),
              price: bar.c,
              vwap: bar.vw,
              volume: bar.v,
              trade_size: bar.n,
            }))
          );
          break;
        case "market_update":
          setMarketData(data);
          setPriceHistory((prev) =>
            [
              ...prev,
              {
                time: new Date().toLocaleTimeString(),
                price: data.c,
                vwap: data.vw,
                volume: data.v,
                trade_size: data.z,
              },
            ].slice(-60)
          );
          setIsSymbolChanging(false);
          break;

        case "news_update":
          setNewsData(data);
          break;

        case "financials_update":
          setFinancialsData(data);
          break;

        default:
          console.log("Unknown message type:", data.type);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => ws.close();
  }, []);

  if (isSymbolChanging || isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className="p-4 bg-gray-900">
      <div className="flex flex-col items-center grow space-y-5">
        <Configuration onConfigurationSubmit={onConfigurationSubmit} />
        <div className="w-full">
          <MarketData marketData={marketData} />
        </div>
      </div>
      <div className="flex-col justify-items-center">
        <div className="flex gap-5 my-8">
          <div className="w-3/4">
            <Charts priceHistory={priceHistory} />
          </div>
          <div className="w-1/4 flex flex-col gap-3">
            <Financials financials={financialsData.financials} />
            <div className="bg-gray-800 flex-grow overflow-y-auto">
              <News articles={newsData.articles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
