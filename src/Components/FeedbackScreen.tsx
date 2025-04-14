import React from "react";
import "./styles.css";

type Props = {
  score: number;
  total: number;
  onRestart: () => void;
};

export default function FeedbackScreen({ score, total, onRestart }: Props) {
  const percentage = (score / total) * 100;
  let feedbackMessage = "";
  let icon = "";
  let primaryClass = "";

  if (percentage >= 80) {
    feedbackMessage = "Excellent!";
    icon = "🏆";
    primaryClass = "green";
  } else if (percentage >= 60) {
    feedbackMessage = "Good job!";
    icon = "👍";
    primaryClass = "blue";
  } else if (percentage >= 40) {
    feedbackMessage = "Keep practicing!";
    icon = "💪";
    primaryClass = "orange";
  } else {
    feedbackMessage = "Better Luck Next Time!";
    icon = "📚";
    primaryClass = "red";
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <div className={`icon-circle ${primaryClass}`}>{icon}</div>
        <h2 className="title">Quiz Finished!</h2>
        <p className="subtitle">{feedbackMessage}</p>
      </div>
      <p className="score">
        Your Score: <span className={`score-value ${primaryClass}`}>{score}</span> / {total} (
        {percentage.toFixed(0)}%)
      </p>
      <button className="restart-button" onClick={onRestart}>
        Try Again
      </button>
    </div>
  );
}
