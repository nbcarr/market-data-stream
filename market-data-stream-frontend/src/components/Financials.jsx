function Financials({ financials }) {
  const metrics = {
    earnings_per_share: { label: "Earnings Per Share" },
    assets: { label: "Assets" },
    equity: { label: "Equity" },
    revenue: { label: "Revenue" },
    net_income: { label: "Net Income" },
    operating_income: { label: "Operating Income" },
  };

  return (
    <div className="bg-gray-800 py-3 px-3 rounded">
      <h2 className="text-white text-center mb-1">Financials</h2>
      <table className="w-full">
        <tbody>
          {Object.entries(financials).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-700">
              <td className="py-2 text-gray-400">
                {metrics[key]?.label || key}
              </td>
              <td className="py-2 text-white text-right">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Financials;
