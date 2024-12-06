"use client";

import { useState, useEffect } from 'react';
import { QuestionTypes } from '@/define/applyTypes';

import ApplyQuestion from './ApplyQuestion';

const AdmissionCreate = ({ questions }) => {
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (questions) {
      setFormData(questions);

      const initialAnswers = {};
      questions.questions.forEach((q, idx) => {
        if (q.type === QuestionTypes.CHECKBOX) {
          initialAnswers[idx] = q.value || [];
        } else {
          initialAnswers[idx] = q.value || '';
        }
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);

  const handleAnswerChange = (index, event) => {
    const value = event.target.value;
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("사용자 응답:", answers);
    alert("폼이 제출되었습니다!");
  };

  if (!formData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
      <p className="mb-6">{formData.description}</p>

      {formData.questions.map((question, index) => {
        const questionWithValue = { ...question, value: answers[index] };
        
        return (
          <div key={index} className="mb-6">
            <ApplyQuestion 
              question={questionWithValue} 
              onChange={(e) => handleAnswerChange(index, e)} 
            />
          </div>
        );
      })}

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