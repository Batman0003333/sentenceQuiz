
import { Question } from "../types/question";
import "./styles.css";

type Props = {
  question: Question;
  userAnswers: string[];
  onRemoveAnswer: (wordToRemove: string) => void;
};

export default function QuestionCard({ question, userAnswers, onRemoveAnswer }: Props) {
  const handleClickBlank = (index: number) => {
    const wordToRemove = userAnswers[index];
    if (wordToRemove) {
      onRemoveAnswer(wordToRemove);
    }
  };

  return (
    <p className="text-lg font-medium mt-4">
      {question.question.split("_____________").map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && (
            <span
              className={`blank ${userAnswers[i] ? "filled" : ""}`}
              onClick={() => handleClickBlank(i)}
            >
              {userAnswers[i] || "__________"}
            </span>
          )}
        </span>
      ))}
    </p>
  );
}
