function Configuration({ onConfigurationSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    onConfigurationSubmit(formJson);
  }

  return (
    <div className="mt-4">
      <form method="post" onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="symbol"
          placeholder="Enter Symbol..."
          className="bg-gray-800 text-white p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Symbol
        </button>
      </form>
    </div>
  );
}
export default Configuration;
