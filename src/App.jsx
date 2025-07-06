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
