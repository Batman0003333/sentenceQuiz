import { Question } from "../types/question";

export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch("http://localhost:5000/data");
  const data = await response.json();
  return data.questions;
};
