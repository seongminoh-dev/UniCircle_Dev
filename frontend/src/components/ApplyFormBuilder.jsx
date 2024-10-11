"use client";
import { useState } from 'react';
import ApplyQuestion from './ApplyQuestion';
import { QuestionTypes, InputLimits } from '@/define/applyTypes';

export const ApplyFormBuilder = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    type: QuestionTypes.TEXT,
    required: false,
    options: [],
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newOption, setNewOption] = useState('');

  // 질문 추가 핸들러
  const addQuestion = () => {
    if (newQuestion.title) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        title: '',
        type: QuestionTypes.TEXT,
        required: false,
        options: [],
      });
      setIsAddingQuestion(false);
      setNewOption('');
    }
  };

  // 질문 제거 핸들러
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // 옵션 추가 핸들러
  const addOption = () => {
    if (newOption) {
      setNewQuestion((prev) => ({ ...prev, options: [...prev.options, newOption] }));
      setNewOption('');
    }
  };

  // 옵션 제거 핸들러
  const removeOption = (index) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // 질문 목록을 저장할 핸들러
  const saveForm = () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      questions: questions,
    };
    // TODO: 데이터 업로드 로직 추가
    console.log('저장된 양식 데이터:', JSON.stringify(formData, null, 2));
    
    alert('양식이 저장되었습니다.');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">동아리 가입 신청 양식</h2>
      {/* 폼 제목과 설명 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="제목"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          maxLength={InputLimits.FORM_TITLE} // 글자 수 제한 적용
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="설명"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          maxLength={InputLimits.FORM_DESCRIPTION} // 글자 수 제한 적용
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* 기존 질문 목록 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">질문 목록</h3>
        {questions.map((question, index) => (
          <div key={index} className="relative p-4 mb-2 border rounded shadow-sm bg-gray-50">
            <ApplyQuestion question={question} onChange={undefined} />
            
            {/* 제거 버튼 */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => removeQuestion(index)}
                className="w-6 h-6 flex items-center justify-center bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                -
              </button>
            </div>
          </div>
        ))}
        {/* 추가 버튼 */}
        <button
          onClick={() => setIsAddingQuestion(true)}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새 질문 추가
        </button>
      </div>

      {/* 새 질문 추가 영역 */}
      {isAddingQuestion && (
        <div className="mb-4 p-4 border rounded">
          <input
            type="text"
            placeholder="질문 제목"
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength={InputLimits.QUESTION_TITLE} // 글자 수 제한 적용
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          >
            <option value={QuestionTypes.TEXT}>문자 입력</option>
            <option value={QuestionTypes.RADIO}>옵션 선택 (단일 선택)</option>
            <option value={QuestionTypes.CHECKBOX}>옵션 선택 (다중 선택)</option>
            <option value={QuestionTypes.DROPDOWN}>드롭다운</option>
          </select>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={newQuestion.required}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, required: e.target.checked }))
              }
              className="mr-2"
            />
            필수 항목
          </label>

          {/* 옵션 입력 영역 */}
          {(newQuestion.type === QuestionTypes.RADIO || newQuestion.type === QuestionTypes.CHECKBOX || newQuestion.type === QuestionTypes.DROPDOWN) && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">옵션 항목</h4>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="옵션 항목"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  maxLength={InputLimits.OPTION_TEXT} // 글자 수 제한 적용
                  className="w-full p-2 pr-10 border border-gray-300 rounded"
                />
                <button
                  onClick={addOption}
                  className="absolute inset-y-0 right-0 px-2 text-lg text-blue-500 hover:text-blue-700"
                >
                  +
                </button>
              </div>
              {/* 기존 옵션 목록 */}
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 mb-2 border rounded">
                  <span>
                    <span className="text-gray-300">{index + 1}.</span>
                    <span className="ml-1">{option}</span>
                  </span>
                  <button
                    onClick={() => removeOption(index)}
                    className="text-lg text-red-500 hover:text-red-700"
                  >
                    -
                  </button>
              </div>
              ))}
            </div>
          )}

          <button
            onClick={addQuestion}
            className="w-full p-2 mb-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            완료
          </button>

          <button
            onClick={() => {
              setIsAddingQuestion(false);
              setNewQuestion({ title: '', type: QuestionTypes.TEXT, required: false, options: [], value: '' });
            }}
            className="w-full p-2 bg-gray-300 text-white rounded hover:bg-gray-500"
          >
            취소
          </button>
        </div>
      )}

      {/* 저장 버튼 */}
      <button
        onClick={saveForm}
        className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        저장
      </button>
    </div>
  );
};

export default ApplyFormBuilder;
