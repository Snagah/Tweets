import { useState } from "react";
import { tweetSuggestions } from "./tweets";

export default function App() {
  const [usedTweets, setUsedTweets] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [suggestions, setSuggestions] = useState(getRandomTweets());

  function getRandomTweets(tags = selectedTags) {
    const pool = tweetSuggestions.filter(
      (tweet) =>
        tags.length === 0 || tags.every((tag) => tweet.tags.includes(tag))
    );
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  function handleRefresh() {
    setSuggestions(getRandomTweets());
  }

  function handleTagClick(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setSuggestions(getRandomTweets());
  }

  function handleUseTweet(tweet) {
    setUsedTweets((prev) => [...prev, tweet.text]);
  }

  const allTags = Array.from(
    new Set(tweetSuggestions.flatMap((tweet) => tweet.tags))
  );

  const unusedSuggestions = suggestions.filter(
    (s) => !usedTweets.includes(s.text)
  );
  const usedSuggestions = suggestions.filter((s) =>
    usedTweets.includes(s.text)
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-rose-300 via-yellow-200 to-red-300">
      <h1 className="text-2xl font-bold mb-4 text-center">Tweet Suggester</h1>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full border ${
              selectedTags.includes(tag)
                ? "bg-green-500 text-white"
                : "bg-white text-green-800"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid gap-4 max-w-xl mx-auto">
        {unusedSuggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md"
          >
            <p className="mb-2">{suggestion.text}</p>
            <div className="flex justify-between items-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  suggestion.text
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Tweet it
              </a>
              <button
                onClick={() => handleUseTweet(suggestion)}
                className="text-sm text-green-600"
              >
                Mark as used
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-full bg-green-500 text-white mt-4"
        >
          Refresh Suggestions
        </button>
      </div>
      {usedSuggestions.length > 0 && (
        <div className="max-w-xl mx-auto mt-6">
          <h2 className="text-lg font-semibold mb-2">Used Tweets</h2>
          {usedSuggestions.map((tweet, idx) => (
            <div
              key={idx}
              className="p-3 mb-2 rounded-xl bg-gray-100 text-gray-600"
            >
              {tweet.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}