"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getCircleById, getEncounteredCircle, getBoardsByCircle } from "@/services";
import { BoardPreview, ModalWrapper, AdmissionCreate } from "@/components";
import BoardEditor from "@/components/BoardEditor";


const CircleDetailPage = ({ params }) => {
    const { circleId } = params; // URL에서 ID 추출
    const [circleInfo, setCircleInfo] = useState(null);
    const auth = useAuth();
    const router = useRouter();
    const [admissionToggle, setAdmissionToggle] = useState(false);
    const [boardToggle, setBoardToggle] = useState(false);
    const [questions, setQuestions] = useState({"title": "", "description": "", "questions":[]});
    const [isCircleMember, setIsCircleMember] = useState(false);
    const [boards, setBoards] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
            const response_circle = await getCircleById(circleId);
            setCircleInfo(response_circle);
            setQuestions(JSON.parse(response_circle.questions))
        };
        fetchData();
    }, [circleId]);

    useEffect(() => {
        const fetchData = async () => {
            if (admissionToggle === false){
                const response_encountered = await getEncounteredCircle(auth.user.email);
                const isIncluded = response_encountered.some(circle => circle.circleId.toString() === circleId);
                setIsCircleMember(isIncluded);
            }
            if (admissionToggle === false){
                const response_boards = await getBoardsByCircle(circleId);
                setBoards(response_boards);
            }
        };
        fetchData();
    }, [admissionToggle, boardToggle]);

    const handleAdmissionToggle = (value) =>{
        if (questions && questions.title){
            setAdmissionToggle(value);
        }else{
            alert("신청할 수 없습니다");
        }
    }


  return (
    <div className="p-6 min-h-screen space-y-6">
        <div className="w-[90%] h-[100%] bg-white flex flex-col items-center gap-[24px] px-[12px] py-[20px] overflow-hidden mx-auto">
            <div className="flex-shrink-0 w-full h-[371px] bg-white shadow rounded-[10px] flex flex-col items-start p-[5px]">
            {circleInfo && (
            <div className="w-full h-[371px] flex flex-col items-start">
                <div className="flex-grow w-full h-[218px] bg-[#D9D9DE] overflow-hidden relative">
                <div className="absolute top-[99px] left-[50%] transform -translate-x-1/2 w-[36px] h-[20px] opacity-30 text-[#26262C] font-SourceSansPro text-[14px] leading-[20px]">
                    image
                </div>
                </div>
                <div className="w-full h-[180px] flex flex-col justify-center items-start gap-[8px] px-[16px] py-[32px]">
                <div className="w-full h-[48px] flex justify-between items-start px-[1px] py-[6px] overflow-hidden">
                    <div className="w-[186px] h-[36px] text-[#26262C] font-OpenSans text-[28px] leading-[36px] font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                    {circleInfo.name}
                    </div>
                    <div className="w-[118px] h-[32px] bg-[#3578FF] shadow rounded-[8px] flex items-center justify-center px-[10px] py-[8px]">
                    {isCircleMember ? (
                        <>
                            <div className="w-[98px] h-[16px] text-[#FFFFFF] font-OpenSans text-[12px] leading-[16px] cursor-pointer font-bold text-center overflow-hidden whitespace-nowrap text-ellipsis">
                                회원 목록
                            </div>
                            <div onClick={() => {setBoardToggle(true)}} className="w-[98px] h-[16px] text-[#FFFFFF] cursor-pointer font-OpenSans text-[12px] leading-[16px] font-bold text-center overflow-hidden whitespace-nowrap text-ellipsis">
                                글쓰기
                            </div>
                        </>
                        ):(
                        <>
                        {/* <div onClick={() => {handleAdmissionToggle(true)}} className="w-[98px] h-[16px] text-[#FFFFFF] cursor-pointer font-OpenSans text-[12px] leading-[16px] font-bold text-center overflow-hidden whitespace-nowrap text-ellipsis">
                            가입하기
                        </div> */}
                        <div onClick={() => {setBoardToggle(true)}} className="w-[98px] h-[16px] text-[#FFFFFF] cursor-pointer font-OpenSans text-[12px] leading-[16px] font-bold text-center overflow-hidden whitespace-nowrap text-ellipsis">
                                글쓰기
                            </div>
                        </>
                    )}
                    </div>
                </div>
                <div className="w-full h-[20px] text-[#4C4C57] font-Inter text-[16px] leading-[19px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {circleInfo.description}
                </div>
                <div className="w-full h-[17px] flex items-center gap-[5px] mt-3">
                    <div className="h-[17px] bg-[#D8D8D8] rounded-[6px] flex items-center justify-center px-[7px] py-[2px] overflow-hidden">
                    <div className="text-[rgba(61,61,61,0.7)] font-Amiko text-[10px] leading-[20px] font-semibold tracking-[0.1em]">
                        {circleInfo.hashtags[0]}
                    </div>
                    </div>
                    <div className="h-[17px] bg-[#D8D8D8] rounded-[6px] flex items-center justify-center px-[7px] py-[2px] overflow-hidden">
                    <div className="text-[rgba(61,61,61,0.7)] font-Amiko text-[10px] leading-[20px] font-semibold tracking-[0.1em]">
                        {circleInfo.hashtags[1]}
                    </div>
                    </div>
                    <div className="h-[17px] bg-[#D8D8D8] rounded-[6px] flex items-center justify-center px-[7px] py-[2px] overflow-hidden">
                    <div className="text-[rgba(61,61,61,0.7)] font-Amiko text-[10px] leading-[20px] font-semibold tracking-[0.1em]">
                        {circleInfo.hashtags[2]}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
            </div>
            <div className="flex-shrink-0 w-full bg-white shadow rounded-[20px] flex flex-col items-start p-[17px]">
            {boards.length == 0 ? 
                (
                    <div className="bg-white rounded-xl shadow p-6 mb-4 w-full">
                        <p>게시글이 없습니다</p>
                    </div>
                ):
                (
                    <>         
                        {boards.map((board, index) => (
                            <BoardPreview key={index} board={board} />
                        ))}
                    </>
                )
            }
            </div>
            {
            admissionToggle && (
                <ModalWrapper isOpen={admissionToggle} onClose={() => setAdmissionToggle(false)}>
                    <AdmissionCreate circleId={circleId} questions={questions} onclose={() => setAdmissionToggle(false)} />
                </ModalWrapper>
            )
            }
            {
                boardToggle && (
                    <ModalWrapper isOpen={boardToggle} onClose={() => setBoardToggle(false)}>
                        <BoardEditor onClose={() => setBoardToggle(false)}/>
                    </ModalWrapper>
                )
            }
        </div>
        <div className="w-full h-[80px] flex justify-center items-center px-[10px] bg-transparent mt-[20px]">
            <div className="w-[60px] h-[60px] relative">
            <div className="absolute inset-0 bg-white"></div>
            <div className="absolute inset-0">
                <div className="absolute inset-0">
                <div className="absolute inset-0 bg-white"></div>
                <svg id="14:9816" className="absolute top-[10%] left-[10%] w-[80%] h-[80%]"></svg>
                </div>
                <div className="absolute inset-0">
                <div className="absolute inset-0 bg-white"></div>
                <svg id="14:9813" className="absolute top-[33.33%] left-[33.33%] w-[33.33%] h-[33.33%]"></svg>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default CircleDetailPage;
