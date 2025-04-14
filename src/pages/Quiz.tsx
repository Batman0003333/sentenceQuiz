import  { useEffect, useState, useRef } from "react";
import { Question as QuestionType } from "../types/question";
import { fetchQuestions } from "../utils/fetchQuestions";
import QuestionCard from "../Components/QuestionCard";
import Options from "../Components/Options";
import Timer from "../Components/Timer";
import FeedbackScreen from "../Components/FeedbackScreen";
import gsap from "gsap";

export default function Quiz() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState<number>(0); // Track number of attempted questions

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const checkButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const feedbackScreenRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    if (!showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true);
      setIsCorrect(false);
    }
  }, [timeLeft, showResult]);

  const handleOptionClick = (word: string) => {
    if (userAnswers.length < 4 && !userAnswers.includes(word)) {
      setUserAnswers([...userAnswers, word]);
    }
  };

  const handleRemoveAnswer = (wordToRemove: string) => {
    setUserAnswers(userAnswers.filter((word) => word !== wordToRemove));
  };

  const handleCheckAnswer = () => {
    const correct = questions[current].correctAnswer;
    const isCorrectAnswer = JSON.stringify(correct) === JSON.stringify(userAnswers);
    setIsCorrect(isCorrectAnswer);
    if (isCorrectAnswer) setScore((prev) => prev + 1);
    setAttempted((prev) => prev + 1); // Increment attempted questions
    setShowResult(true);
  };

  const handleNext = () => {
    setUserAnswers([]);
    setShowResult(false);
    setIsCorrect(null);
    setCurrent((prev) => prev + 1);
    setTimeLeft(30);
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setUserAnswers([]);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(30);
    setAttempted(0); // Reset attempted questions
  };

  // Animate progress bar and change color
  useEffect(() => {
    if (progressRef.current) {
      const progressPercentage = ((current + 1) / questions.length) * 100;
      const progressColor = attempted > 0 ? "bg-orange-500" : "bg-gray-300"; // Orange for attempted, gray for not attempted

      gsap.to(progressRef.current, {
        width: `${progressPercentage}%`,
        duration: 0.5,
        ease: "power2.out",
      });

      progressRef.current.className = `h-full transition-all duration-500 ${progressColor}`;
    }
  }, [current, attempted, questions.length]);

  if (!questions.length) return <div className="p-6 text-center">Loading...</div>;

  const q = questions[current];

  return (
    <div ref={containerRef} className="max-w-xl mx-auto p-6 relative">
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-6">
        <div
          ref={progressRef}
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: "0%" }} // Make sure the progress starts from 0
        />
      </div>

      <h1 ref={titleRef} className="text-3xl font-bold text-center mb-4">🧠 Sentence Quiz</h1>

      {/* Timer Section */}
      <div ref={timerRef}>
        <Timer timeLeft={timeLeft} />
      </div>

      {/* Question Card: Fixed position */}
      <div
        ref={questionCardRef}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 p-6 bg-white rounded-lg shadow-lg z-10"
        style={{ maxWidth: '80%', width: '900px' }}
      >
        <QuestionCard question={q} userAnswers={userAnswers} onRemoveAnswer={handleRemoveAnswer} />
      </div>

      {/* Options Section */}
      <div ref={optionsRef} className="mt-80 pt-24">
        <Options options={q.options} userAnswers={userAnswers} handleOptionClick={handleOptionClick} />
      </div>

      <div className="mt-6 text-center">
        {!showResult ? (
          <button
            ref={checkButtonRef}
            onClick={handleCheckAnswer}
            disabled={userAnswers.length !== 4}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <div className="mt-3 text-lg">
            {isCorrect ? (
              <span className="text-green-600 font-semibold">🎉 Correct!</span>
            ) : (
              <span className="text-red-600 font-semibold">❌ Incorrect!</span>
            )}
          </div>
        )}

        {showResult && current < questions.length - 1 && (
          <button
            ref={nextButtonRef}
            onClick={handleNext}
            className="ml-4 bg-purple-500 text-white px-4 py-2 rounded-xl"
          >
            Next
          </button>
        )}

        {showResult && current === questions.length - 1 && (
          <div ref={feedbackScreenRef}>
            <FeedbackScreen score={score} total={questions.length} onRestart={handleRestart} />
          </div>
        )}
      </div>
    </div>
  );
}
