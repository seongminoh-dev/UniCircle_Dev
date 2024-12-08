"use client";

import ApplyQuestion from './ApplyQuestion';

const ApplyFormViewer = ({ formData, onClickAccept}) => {
  if (!formData || !formData.title) {
    return <div>로딩 중...</div>;
  }
  return (
    <div className="w-96 mx-auto p-2 bg-white">
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
        onClick={onClickAccept}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        수락하기
      </button>
    </div>
  );
};

export default ApplyFormViewer;