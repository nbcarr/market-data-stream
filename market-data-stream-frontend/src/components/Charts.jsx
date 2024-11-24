import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import { useState } from "react";

// TODO:
// - Refactor this to make it easier to add new checkbox fields
// - Add technical indicators
function Charts({ priceHistory }) {
  const [graphConfig, setGraphConfig] = useState({
    showPrice: true,
    showVWAP: false,
    showVolume: false,
    showTradeSize: false,
  });

  function onCheckboxSelect(event) {
    const { checked, name } = event.target;
    setGraphConfig((prevConfig) => ({
      ...prevConfig,
      [name]: checked,
    }));
  }

  const prices = priceHistory.map((item) => item.price);
  const minPrice = Math.min(...prices); // for y-axis scaling
  const maxPrice = Math.max(...prices);

  return (
    <div className="bg-black-800 p-4 rounded shadow-lg">
      <ResponsiveContainer width="100%" height={525}>
        <ComposedChart data={priceHistory}>
          <CartesianGrid strokeDasharray="5 5" stroke="#555" />
          <XAxis
            dataKey="time"
            stroke="#ccc"
            tick={{ fill: "#ccc" }}
            tickSize={12}
          />
          <YAxis
            domain={[minPrice - 2, maxPrice + 2]}
            stroke="#ccc"
            tick={{ fill: "#ccc" }}
            tickSize={12}
            yAxisId="price"
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            domain={[0, (dataMax) => dataMax * 5]}
            stroke="#ccc"
            tick={{ fill: "#ccc" }}
          />
          <YAxis
            yAxisId="trade_size"
            orientation="left"
            domain={[0, (dataMax) => dataMax * 5]}
            stroke="#ccc"
            tick={{ fill: "#ccc" }}
          />
          <Tooltip
            wrapperStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              border: "1px solid #888",
              borderRadius: "4px",
            }}
            contentStyle={{
              color: "white",
              fontSize: "12px",
              padding: "8px",
            }}
          />
          {graphConfig.showPrice && (
            <Line
              type="monotone"
              yAxisId="price"
              dataKey="price"
              stroke="#388B33"
              isAnimationActive={false}
              strokeWidth={3}
              dot={false}
            />
          )}
          {graphConfig.showVWAP && (
            <Line
              type="monotone"
              dataKey="vwap"
              yAxisId="price"
              stroke="#82ca9d"
              isAnimationActive={false}
              strokeWidth={2}
              dot={false}
            />
          )}
          {graphConfig.showVolume && (
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#a2a832"
              opacity={0.5}
              isAnimationActive={false}
            />
          )}

          {graphConfig.showTradeSize && (
            <Bar
              type="monotone"
              dataKey="trade_size"
              yAxisId="trade_size"
              fill="#3258a8"
              opacity={0.5}
              isAnimationActive={false}
            />
          )}

          {graphConfig.showMA && (
            <Line
              type="monotone"
              dataKey="ma"
              stroke="#ff0000"
              isAnimationActive={false}
              strokeWidth={2}
              dot={false}
            />
          )}
          <Legend
            iconType="square"
            iconSize={10}
            layout="vertical"
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: "14px",
              color: "#ccc",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-row gap-4 px-10">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showPrice"
            checked={graphConfig.showPrice}
            onChange={onCheckboxSelect}
          />
          <span className="text-white text-sm">Price</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showVWAP"
            checked={graphConfig.showVWAP}
            onChange={onCheckboxSelect}
          />
          <span className="text-white text-sm">VWAP</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showVolume"
            checked={graphConfig.showVolume}
            onChange={onCheckboxSelect}
          />
          <span className="text-white text-sm">Volume</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showTradeSize"
            checked={graphConfig.showTradeSize}
            onChange={onCheckboxSelect}
          />
          <span className="text-white text-sm">Trade Size</span>
        </label>

        <label className="flex items-center space-x-2"></label>
      </div>
    </div>
  );
}

export default Charts;
