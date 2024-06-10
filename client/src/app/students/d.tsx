import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CreateQuestionModal from './CreateQuestionModal';
import GenerateQuestionModal from './GenerateQuestionModal';
import axios from 'axios';
import { useAuth } from "../../../authMiddleware";
import ErrorPage from '@/app/error/page';

const QuestionsPage = () => {
  const router = useRouter();
  const { examId } = router.query;
  const { authToken, userId } = useAuth();
  const [exam, setExam] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateQuestionModalOpen, setCreateQuestionModalOpen] = useState(false);
  const [isGenerateQuestionModalOpen, setGenerateQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const examResponse = await axios.get(`http://localhost:3000/api/exams/${examId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const examData = examResponse.data;

        const updatedQuestions = await Promise.all(
          examData.questions.map(async (question) => {
            const questionResponse = await axios.get(`http://localhost:3000/api/questions/${question.question_id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            });
            return questionResponse.data;
          })
        );

        setQuestions(updatedQuestions);
        setExam(examData);
      } catch (error) {
        console.error("Error fetching exam and questions:", error);
      }
    };
    fetchExamAndQuestions();
  }, [examId, authToken]);

  if (!exam) {
    return <ErrorPage />;
  }

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsCreating(false);
  };

  const handleCreateQuestionClick = () => {
    setSelectedQuestion(null);
    setIsCreating(true);
  };

  const handleInputChange = (e, index) => {
    const { name, value, type } = e.target;
    if (name.startsWith("option")) {
      const updatedOptions = selectedQuestion.options.map((option, i) => {
        if (i === index) {
          return { ...option, option: value };
        }
        return option;
      });
      setSelectedQuestion({ ...selectedQuestion, options: updatedOptions });
    } else if (type === "radio") {
      setSelectedQuestion({ ...selectedQuestion, correctOption: parseInt(value) });
    } else {
      setSelectedQuestion({ ...selectedQuestion, [name]: value });
    }
  };

  const handleAddOption = () => {
    setSelectedQuestion({
      ...selectedQuestion,
      options: [...selectedQuestion.options, ""]
    });
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = selectedQuestion.options.filter((option, i) => i !== index);
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions
    });
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:3000/api/questions/${selectedQuestion.question_id}`, selectedQuestion, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log("Updated Question:", response.data);
      const updatedQuestions = questions.map(q => q.question_id === selectedQuestion.question_id ? selectedQuestion : q);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/questions/${selectedQuestion.question_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const updatedQuestions = questions.filter(q => q.question_id !== selectedQuestion.question_id);
      setQuestions(updatedQuestions);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };