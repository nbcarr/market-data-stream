function MarketData({ marketData }) {
  const metrics = {
    symbol: {
      label: "Symbol",
      value: marketData.sym || "",
    },
    price: {
      label: "Price",
      value: marketData.c || "",
    },
    volume: {
      label: "Volume",
      value: marketData.v || "",
    },
    vwap: {
      label: "VWAP",
      value: marketData.vw || "",
    },
    open: {
      label: "Todays Open",
      value: marketData.op || "",
    },
    avg_trade: {
      label: "Average Trade Size",
      value: marketData.z || "",
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            {Object.entries(metrics).map(([key, value]) => (
              <th key={key} className="text-gray-400 text-center px-4 py-2">
                {value.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            {Object.entries(metrics).map(([key, metric]) => (
              <td key={key} className="text-white text-center px-4 py-2">
                {metric.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MarketData;
