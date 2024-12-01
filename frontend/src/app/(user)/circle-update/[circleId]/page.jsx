"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getCircleById, updateCircle, createCircle } from "@/services";

const CircleUpdatePage = ({ params }) => {
  const { circleId } = params;
  const [updatedCircleInfo, setUpdatedCircleInfo] = useState({"name": "", "description": "", "email": "", "hashtags": [], "questions": ""});
  const router = useRouter();
  const auth = useAuth();

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
      filtered.email = auth.user.userId;
      setUpdatedCircleInfo(filtered);
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

  // 테스트용 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (circleId === "0") {
      updatedCircleInfo.email = auth.user.userId;
      createCircle(updatedCircleInfo);
      router.push("/boards/related");
    }
    else
      updateCircle(circleId, updatedCircleInfo);
      router.push(`/circle-detail/${circleId}`);
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
                    <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                        <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                        <div className="text-[#91929F] text-[10px] leading-[20px]">
                        동아리 이름
                        </div>
                        <input className="flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="name" value={updatedCircleInfo.name} onChange={handleInputChange}/>
                        </div>
                        <img src="check.svg" alt="아이콘" className="w-8 h-8" />
                    </div>
                    <div className="w-full h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                        <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                        <div className="text-[#91929F] text-[10px] leading-[20px]">
                        동아리 소개
                        </div>
                        <input className="flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="description" value={updatedCircleInfo.description} onChange={handleInputChange}/>
                        </div>
                        <img src="check.svg" alt="아이콘" className="w-8 h-8" />
                    </div>
                    <div className="w-full h-[60px] rounded flex flex-row justify-start items-start pt-[4px] pb-[20px] gap-x-[11px]">
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 1
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 0" value={updatedCircleInfo.hashtags[0]} onChange={(e) => {handleHashtagChange(0, e.target.value)}}/>
                            </div>
                            <img src="check.svg" alt="아이콘" className="w-8 h-8" />
                        </div>
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 2
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 1" value={updatedCircleInfo.hashtags[1]} onChange={(e) => {handleHashtagChange(1, e.target.value)}}/>
                            </div>
                            <img src="check.svg" alt="아이콘" className="w-8 h-8" />
                        </div>
                        <div className="w-[164px] h-[60px] border border-[#D9D9DE] rounded flex flex-row justify-start items-start px-[12px] pt-[4px] pb-[20px]">
                            <div className="w-full h-[20px] flex-col items-start gap-x-[20px]">
                            <div className="text-[#91929F] text-[10px] leading-[20px]">
                            해시태그 3
                            </div>
                            <input className="w-[80px] flex-grow text-[#26262C] font-semibold text-[16px] leading-[20px]" name="hashtag 2" value={updatedCircleInfo.hashtags[2]} onChange={(e) => {handleHashtagChange(2, e.target.value)}}/>
                            </div>
                            <img src="check.svg" alt="아이콘" className="w-8 h-8" />
                        </div>
                    </div>

                <div className="w-full h-[52px] bg-[#3578FF] rounded flex justify-center items-center" onClick={handleSubmit}>
                    <div className="text-white font-semibold text-[14px] leading-[20px]">
                    Save
                    </div>
                </div>
            </div>
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
