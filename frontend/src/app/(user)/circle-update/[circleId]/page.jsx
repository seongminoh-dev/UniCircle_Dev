"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { ApplyFormBuilder, ModalWrapper } from "@/components";
import { getCircleById, updateCircle, createCircle } from "@/services";

const CircleUpdatePage = ({ params }) => {
  const { circleId } = params;
  const [updatedCircleInfo, setUpdatedCircleInfo] = useState({"name": "", "description": "", "email": "", "hashtags": [], "questions": ""});
  const [questions, setQuestions] = useState({"title":"", "description":"", "questions":[]})
  const [questionToggle, setQuestionToggle] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const extractQuestions = (jsonString) => {
    try {
      // JSON 문자열을 파싱
      const parsedData = JSON.parse(jsonString);
  
      // 필요한 필드 추출
      const title = typeof parsedData.title === "string" ? parsedData.title : "";
      const description =
        typeof parsedData.description === "string" ? parsedData.description : "";
      const questions = Array.isArray(parsedData.questions)
        ? parsedData.questions
        : [];
  
      return { title: title, description: description, questions: questions };
    } catch (error) {
      // JSON 파싱 실패 시 기본값 반환
      return { title: "", description: "", questions: [] };
    }
  };
  

  const filterKeys = (data, keys) => {
    return Object.keys(data)
      .filter((key) => keys.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCircleById(circleId);
      const allowedKeys = ["name", "description", "email", "hashtags", "questions"];
      const filtered = filterKeys(response, allowedKeys);
      filtered.email = auth.user.email;
      setUpdatedCircleInfo(filtered);
      setQuestions(extractQuestions(filtered.questions));
    };
    if (circleId !== "0")
      fetchData();
  }, [circleId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCircleInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleQuestionChange = (value) => {
    setQuestions(value);
    setUpdatedCircleInfo((prevData) => ({
      ...prevData,
      ["questions"]: JSON.stringify(value),
    }));
  }

  // 테스트용 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (circleId === "0") {
      try{
        updatedCircleInfo.email = auth.user.userId;
        await createCircle(updatedCircleInfo);
        router.push("/boards/related");
      }catch {
        router.push("/boards/related");
      }
    }
    else
      try{
        await updateCircle(circleId, updatedCircleInfo);
        router.push(`/circle-detail/${circleId}`);
      }catch {
        router.push(`/circle-detail/${circleId}`);
      }
  };

  return (
    <div className="p-6 min-h-screen space-y-6">
        <div className="flex flex-col relative">
            
        <div className="w-full flex flex-col items-start overflow-hidden">
            {updatedCircleInfo && (
                <>
                <div className="w-full h-[347px] flex items-end p-[8px] bg-[#EEEEF0] relative">
                <img src="https://image-resource.creatie.ai/139025621997997/139025621998006/bdf19faa702d587331b82c039b703068.jpeg" className="absolute inset-0 w-full h-full object-cover" />
                <img src="add.svg" alt="아이콘" className="w-8 h-8" />
                </div>
                <div className="w-full flex flex-col items-start space-y-[24px] px-[24px] pt-[88px] pb-[24px] bg-white">
                    <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[4px]">
                        <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                        <div className="text-[#91929F] text-[10px] leading-[20px]">
                        동아리 이름
                        </div>
                        <input className="flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="name" value={updatedCircleInfo.name} onChange={handleInputChange}/>
                        </div>
                        <img src="/check.svg" alt="아이콘" className="w-8 h-8 mt-2" />
                    </div>
                    <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                        <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                        <div className="text-[#91929F] text-[10px] leading-[20px]">
                        동아리 소개
                        </div>
                        <input className="flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="description" value={updatedCircleInfo.description} onChange={handleInputChange}/>
                        </div>
                        <img src="/check.svg" alt="아이콘" className="w-8 h-8 mt-2" />
                    </div>
                    <div className="w-full h-[60px] rounded flex flex-row justify-start items-start pt-[4px] pb-[20px] gap-x-[11px]">
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 1
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 0" value={updatedCircleInfo.hashtags[0]} onChange={(e) => {handleHashtagChange(0, e.target.value)}}/>
                            </div>
                            <img src="/check.svg" alt="아이콘" className="w-8 h-8 mt-2" />
                        </div>
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 2
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 1" value={updatedCircleInfo.hashtags[1]} onChange={(e) => {handleHashtagChange(1, e.target.value)}}/>
                            </div>
                            <img src="/check.svg" alt="아이콘" className="w-8 h-8 mt-2" />
                        </div>
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 3
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 2" value={updatedCircleInfo.hashtags[2]} onChange={(e) => {handleHashtagChange(2, e.target.value)}}/>
                            </div>
                            <img src="/check.svg" alt="아이콘" className="w-8 h-8 mt-2" />
                        </div>
                    </div>
                {!questionToggle &&
                  ( 
                    <div className="w-full h-[52px] bg-purple-500  rounded flex justify-center items-center" onClick={() => {setQuestionToggle(true)}}>
                      <div className="text-white font-semibold text-[14px] leading-[20px]">
                      가입 양식 수정
                      </div>
                    </div>
                  )
                }
                <div className="w-full h-[52px] bg-[#3578FF] rounded flex justify-center items-center" onClick={handleSubmit}>
                    <div className="text-white font-semibold text-[14px] leading-[20px]">
                    Save
                    </div>
                </div>
            </div>
            {questionToggle &&
              (
                <ModalWrapper isOpen={questionToggle} onClose={() => setQuestionToggle(false)}>
                  <ApplyFormBuilder questions={questions} handleQuestionChange={handleQuestionChange} onClose={() => setQuestionToggle(false)}/>
                </ModalWrapper>
              )
            }
            </>
            )}
        </div>

        <div className="w-full h-[80px] flex justify-center items-center px-[10px] bg-transparent">
            <div className="w-[60px] h-[60px] relative">
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute inset-0">
                <div className="absolute inset-0">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white"></div>
                    <svg id="10:5706" className="absolute top-[10%] left-[10%] w-[80%] h-[80%]"></svg>
                </div>
                </div>
                <div className="absolute inset-0">
                <div className="absolute inset-0 bg-white"></div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default CircleUpdatePage;
