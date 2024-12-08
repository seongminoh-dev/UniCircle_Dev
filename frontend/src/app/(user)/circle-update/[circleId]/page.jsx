"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { ApplyFormBuilder, ModalWrapper } from "@/components";
import { getCircleById, updateCircle, createCircle } from "@/services";

const CircleUpdatePage = ({ params }) => {
  const { circleId } = params;
  const [updatedCircleInfo, setUpdatedCircleInfo] = useState({
    name: "",
    description: "",
    email: "",
    hashtags: [],
    questions: "",
    image: null, // File 객체로 관리
  });
  const [questions, setQuestions] = useState({
    title: "",
    description: "",
    questions: []
  });
  const [questionToggle, setQuestionToggle] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const router = useRouter();
  const auth = useAuth();

  // 질문 추출 함수
  const extractQuestions = (jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString);
      const title = typeof parsedData.title === "string" ? parsedData.title : "";
      const description = typeof parsedData.description === "string" ? parsedData.description : "";
      const questions = Array.isArray(parsedData.questions) ? parsedData.questions : [];
      return { title, description, questions };
    } catch (error) {
      console.error("Error parsing questions JSON:", error);
      return { title: "", description: "", questions: [] };
    }
  };

  // 데이터 필터링 함수
  const filterKeys = (data, keys) => {
    return Object.keys(data)
      .filter((key) => keys.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCircleById(circleId);
        const allowedKeys = ["name", "description", "adminUser", "hashtags", "questions", "image"];
        const filtered = filterKeys(response, allowedKeys);
        if (circleId !== 0 && filtered.adminUser.email !== auth.user.email) {
          alert("본인이 아닌 동아리는 수정할 수 없습니다.");
          router.push("/boards/related");
          return;
        }
        setUpdatedCircleInfo({
          name: filtered.name || "",
          description: filtered.description || "",
          email: filtered.adminUser.email || auth.user.email,
          hashtags: filtered.hashtags || [],
          questions: filtered.questions || "",
          image: filtered.image || null,
        });
        if (typeof filtered.image === 'string') {
          setImagePreviewUrl(`data:image/jpeg;base64,${filtered.image}`);
        }
        setQuestions(extractQuestions(filtered.questions));
      } catch (error) {
        console.error("Error fetching circle data:", error);
      }
    };
    if (circleId !== "0") fetchData();
  }, [circleId, auth.user.email]);

  // 이미지 변경 시 미리보기 URL 설정
  useEffect(() => {
    let objectUrl = null;
    if (updatedCircleInfo.image instanceof File) {
      objectUrl = URL.createObjectURL(updatedCircleInfo.image);
      setImagePreviewUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [updatedCircleInfo.image]);

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCircleInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 해시태그 변경 핸들러
  const handleHashtagChange = (index, value) => {
    setUpdatedCircleInfo((prevData) => {
      const updatedHashtags = [...prevData.hashtags];
      updatedHashtags[index] = value;
      return {
        ...prevData,
        hashtags: updatedHashtags,
      };
    });
  };

  // 질문 변경 핸들러
  const handleQuestionChange = (value) => {
    setQuestions(value);
    setUpdatedCircleInfo((prevData) => ({
      ...prevData,
      questions: JSON.stringify(value),
    }));
  };

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('유효한 이미지 파일을 선택해주세요.');
        return;
      }
      setUpdatedCircleInfo((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (circleId === "0") {
        const formData = new FormData();
        formData.append('name', updatedCircleInfo.name);
        formData.append('description', updatedCircleInfo.description);
        formData.append('email', auth.user.email);
        formData.append('hashtags', updatedCircleInfo.hashtags);
        formData.append('questions', updatedCircleInfo.questions);
        if (updatedCircleInfo.image instanceof File) {
          formData.append('file', updatedCircleInfo.image, updatedCircleInfo.image.name);
        }
        await createCircle(formData);
        router.push("/boards/related");
      } else {
        const formData = new FormData();
        formData.append('name', updatedCircleInfo.name);
        formData.append('description', updatedCircleInfo.description);
        formData.append('email', updatedCircleInfo.email);
        formData.append('hashtags', updatedCircleInfo.hashtags);
        formData.append('questions', updatedCircleInfo.questions);
        if (updatedCircleInfo.image instanceof File) {
          formData.append('file', updatedCircleInfo.image, updatedCircleInfo.image.name);
        }
        await updateCircle(circleId, formData);
        router.push(`/circle-detail/${circleId}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // 에러 처리 로직 추가 가능
      if (circleId === "0") {
        alert("동아리 생성에 실패했습니다.");
        router.push("/boards/related");
      } else {
        router.push(`/circle-detail/${circleId}`);
      }
    }
  };

  // 이미지 소스 결정 함수
  const getImageSrc = () => {
    if (imagePreviewUrl) {
      return imagePreviewUrl;
    }
    return "https://image-resource.creatie.ai/139025621997997/139025621998006/bdf19faa702d587331b82c039b703068.jpeg";
  };

  return (
    <div className="p-6 min-h-screen space-y-6">
      <div className="flex flex-col relative">
        <div className="w-full flex flex-col items-start overflow-hidden">
          {updatedCircleInfo && (
            <>
              <div className="w-full h-[347px] flex items-end p-[8px] bg-[#EEEEF0] relative">
                <img
                  src={getImageSrc()}
                  alt="동아리 이미지"
                  className="w-full h-full object-cover"
                />
                <label htmlFor="imageUpload" className="absolute bottom-2 right-2 cursor-pointer">
                  <img src="/add.svg" alt="아이콘" className="w-8 h-8" />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="w-full flex flex-col items-start space-y-[24px] px-[24px] pt-[88px] pb-[24px] bg-white">
                <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-center px-[12px] py-[4px]">
                  <div className="w-full flex flex-col gap-y-1">
                    <label className="text-[#91929F] text-[10px] leading-[20px]">동아리 이름</label>
                    <input
                      className="w-full text-[#26262C] font-semibold text-[16px] leading-[20px] focus:outline-none"
                      name="name"
                      value={updatedCircleInfo.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <img src="/check.svg" alt="아이콘" className="w-8 h-8 ml-2" />
                </div>

                <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-center px-[12px] py-[4px]">
                  <div className="w-full flex flex-col gap-y-1">
                    <label className="text-[#91929F] text-[10px] leading-[20px]">동아리 소개</label>
                    <input
                      className="w-full text-[#26262C] font-semibold text-[16px] leading-[20px] focus:outline-none"
                      name="description"
                      value={updatedCircleInfo.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <img src="/check.svg" alt="아이콘" className="w-8 h-8 ml-2" />
                </div>

                {/* 해시태그 입력 */}
                <div className="w-full h-[60px] flex flex-row justify-start items-start pt-[4px] pb-[20px] gap-x-[11px]">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="flex-grow h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-center px-[12px]"
                    >
                      <div className="w-full flex flex-col gap-y-1">
                        <label className="text-[#91929F] text-[10px] leading-[20px]">해시태그 {index + 1}</label>
                        <input
                          className="w-full text-[#26262C] font-semibold text-[16px] leading-[20px] focus:outline-none"
                          name={`hashtag ${index}`}
                          value={updatedCircleInfo.hashtags[index] || ""}
                          onChange={(e) => handleHashtagChange(index, e.target.value)}
                        />
                      </div>
                      <img src="/check.svg" alt="아이콘" className="w-8 h-8 ml-2" />
                    </div>
                  ))}
                </div>

                {!questionToggle && (
                  <div
                    className="cursor-pointer shadow-md w-full h-[52px] bg-purple-500 rounded flex justify-center items-center"
                    onClick={() => setQuestionToggle(true)}
                  >
                    <div className="text-white font-semibold text-md leading-[20px]">가입 양식 수정</div>
                  </div>
                )}

                <div
                  className="cursor-pointer w-full h-[52px] bg-[#3578FF] rounded flex justify-center items-center"
                  onClick={handleSubmit}
                >
                  <div className="text-white font-semibold text-md leading-[20px]">Save</div>
                </div>
              </div>

              {questionToggle && (
                <ModalWrapper
                  isOpen={questionToggle}
                  onClose={() => setQuestionToggle(false)}
                  isTransparent={true}
                >
                  <ApplyFormBuilder
                    questions={questions}
                    handleQuestionChange={handleQuestionChange}
                    onClose={() => setQuestionToggle(false)}
                  />
                </ModalWrapper>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleUpdatePage;