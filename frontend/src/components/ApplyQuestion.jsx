"use client";
import {QuestionTypes} from '@/define/applyTypes';

// 개별 입력 컴포넌트들 정의
const TextInput = ({ value, onChange }) => (
    <input
        type="text"
        placeholder="텍스트 입력"
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded"
    />
);

const RadioInput = ({ options, value, onChange }) => (
    <div>
        {options.map((option, index) => (
        <label key={index} className="block mb-1">
            <input
            type="radio"
            name="radioGroup"
            value={option}
            checked={value === option}
            onChange={onChange}
            className="mr-2"
            />
            {option}
        </label>
        ))}
    </div>
);

const CheckBoxInput = ({ options, value, onChange }) => (
    <div>
        {options.map((option, index) => (
        <label key={index} className="block mb-1">
            <input
            type="checkbox"
            value={option}
            checked={value.includes(option)}
            onChange={(e) => {
                const newValue = e.target.checked
                ? [...value, option]
                : value.filter((val) => val !== option);
                onChange({ target: { value: newValue } });
            }}
            className="mr-2"
            />
            {option}
        </label>
        ))}
    </div>
);

const DropdownInput = ({ options, value, onChange }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded"
    >
        <option value="">옵션을 선택하세요</option>
        {options.map((option, index) => (
        <option key={index} value={option}>
            {option}
        </option>
        ))}
    </select>
);
  
export const ApplyQuestion = ({ question, onChange }) => {
    // onChange가 전달되지 않으면 빈 함수로 처리
    const handleChange = onChange || (() => {});
  
    return (
        <div className="mb-4">
        <div className="flex items-center mb-2">
            <span className="font-medium">{question.title}</span>
            {question.required && <span className="ml-2 text-red-500">*필수</span>}
        </div>
        {/* question.type에 따라 적절한 컴포넌트를 렌더링 */}
        {question.type === QuestionTypes.TEXT && (
            <TextInput value={question.value || ''} onChange={handleChange} />
        )}
        {question.type === QuestionTypes.RADIO && (
            <RadioInput options={question.options} value={question.value || ''} onChange={handleChange} />
        )}
        {question.type === QuestionTypes.CHECKBOX && (
            <CheckBoxInput options={question.options} value={question.value || []} onChange={handleChange} />
        )}
        {question.type === QuestionTypes.DROPDOWN && (
            <DropdownInput options={question.options} value={question.value || ''} onChange={handleChange} />
        )}
        </div>
    );
};

export default ApplyQuestion;