"use client";

import { useState, useEffect } from 'react';
import { QuestionTypes } from '@/define/applyTypes';
import ApplyQuestion from './ApplyQuestion';
import { useAuth } from "@/hooks";
import { sendAdmissionForm } from "@/services";

const AdmissionCreate = ({ circleId, questions, onClose }) => {
  const [formData, setFormData] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (questions) {
      const updatedQuestions = questions.questions.map((q) => {
        if (q.type === QuestionTypes.CHECKBOX) {
          return { ...q, value: q.value || [] };
        } else {
          return { ...q, value: q.value || '' };
        }
      });

      setFormData({
        title: questions.title,
        description: questions.description,
        questions: updatedQuestions,
      });
    }
  }, [questions]);

  const handleAnswerChange = (index, event) => {
    const value = event.target.value;

    setFormData((prevFormData) => {
      const updatedQuestions = [...prevFormData.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        value: value,
      };
      return { ...prevFormData, questions: updatedQuestions };
    });
  };

  const handleSubmit = () => {
    sendAdmissionForm({"circleId":circleId, "userId":auth.user.userId, "formContent":formData});
    onClose();
  };

  if (!formData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mx-auto p-6 bg-white border w-[600px] rounded shadow-lg">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
      <p className="mb-6">{formData.description}</p>
      <div className="max-h-96 overflow-y-auto">
      {formData.questions.map((question, index) => (
        <div key={index} className="mb-6">
          <ApplyQuestion
            question={question}
            onChange={(e) => handleAnswerChange(index, e)}
          />
        </div>
      ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        제출하기
      </button>
    </div>
  );
};

export default AdmissionCreate;