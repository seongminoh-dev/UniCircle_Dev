"use client";

import { useState, useEffect } from 'react';
import { QuestionTypes } from '@/define/applyTypes';
import ApplyQuestion from './ApplyQuestion';
import { useAuth } from "@/hooks";
import { sendAdmissionForm } from "@/services";

const AdmissionCreate = ({ circleId, questions, onclose }) => {
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
    sendAdmissionForm( circleId, auth.user.userId, formData);
    onclose();
  };

  if (!formData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mx-auto p-6 bg-white border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
      <p className="mb-6">{formData.description}</p>

      {formData.questions.map((question, index) => (
        <div key={index} className="mb-6">
          <ApplyQuestion
            question={question}
            onChange={(e) => handleAnswerChange(index, e)}
          />
        </div>
      ))}

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