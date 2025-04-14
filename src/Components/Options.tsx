import React from "react";
import "./styles.css"; // <-- import the CSS file

type Props = {
  options: string[];
  userAnswers: string[];
  handleOptionClick: (word: string) => void;
};

export default function Options({ options, userAnswers, handleOptionClick }: Props) {
  return (
    <div className="options-grid">
      {options.map((option) => (
        <button
          key={option}
          className="option-button"
          onClick={() => handleOptionClick(option)}
          disabled={userAnswers.includes(option) || userAnswers.length >= 4}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
