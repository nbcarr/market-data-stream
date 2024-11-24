function News({ articles }) {
  return (
    <div className="p-3 mt-2 rounded h-60">
      <h2 className="text-white mb-2 text-center">Latest News</h2>
      <div className="h-full overflow-y-auto">
        {articles?.map((article, index) => (
          <div key={index} className="border-b border-gray-700  mb-2">
            <h3 className="text-white text-sm">{article.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{article.description}</p>
            <div className="flex justify-between mt-2 text-xs">
              <span
                className={
                  article.sentiment === "positive"
                    ? "text-green-500"
                    : article.sentiment === "negative"
                    ? "text-red-500"
                    : "text-gray-400"
                }
              >
                {article.sentiment}
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
