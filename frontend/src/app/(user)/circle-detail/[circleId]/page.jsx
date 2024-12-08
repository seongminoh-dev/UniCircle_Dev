"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getCircleById, getEncounteredCircle, getBoardsByCircle, getAllFormByCircleId } from "@/services";
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
    const [alreadySubmit, setAlreadySubmit] = useState(false);
    const [boards, setBoards] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
            const response_circle = await getCircleById(circleId);
            setCircleInfo(response_circle);
            setQuestions(response_circle.questions)
        };
        fetchData();
    }, [circleId]);

    useEffect(() => {
        const fetchData = async () => {
            if (admissionToggle === false){
                const response_encountered = await getEncounteredCircle(auth.user.email);
                const isIncluded = response_encountered.some(circle => circle.circleId.toString() === circleId);
                setIsCircleMember(isIncluded);
                const response_admission = await getAllFormByCircleId(circleId);
                const submitted = response_admission.some(admission => admission.form.userId === auth.user.userId && admission.form.status === "PENDING");
                setAlreadySubmit(submitted);
            }
            if (boardToggle === false){
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

    const handleMemberListClicked = () => {
        router.push(`/circle-members?circleId=${circleId}`);
    };

  return (
    <div className="px-2">
    
            <div className="bg-white rounded-lg shadow">
            {circleInfo && (
            <div className="mb-8 p-1 h-[371px] flex flex-col items-start">
                <div className="flex-grow w-full bg-gray-400 overflow-hidden relative">
                <div className="absolute top-[99px] left-[50%] transform -translate-x-1/2 w-[36px] h-[20px] opacity-30 text-[#26262C] font-SourceSansPro text-[14px] leading-[20px]">
                    image
                </div>
                </div>
                <div className="w-full h-[180px] flex flex-col justify-center items-start gap-[8px] px-[16px] py-[32px]">
                <div className="w-full h-[48px] flex justify-between items-end px-[1px] py-[6px] overflow-hidden">
                    <div className="w-full h-10 text-[#26262C] font-OpenSans text-[28px] leading-[36px] font-bold overflow-hidden whitespace-nowrap">
                    {circleInfo.name}
                    </div>
                    <div className="w-[300px] h-[32px] flex items-center justify-end px-[10px] py-[8px]">
                    {isCircleMember ? (
                        <>
                            <div className="flex items-center justify-center gap-[5px]">
                                <div 
                                onClick={handleMemberListClicked}
                                className="w-[118px] h-[32px] text-[#FFFFFF] bg-[#3578FF] rounded-[8px] flex items-center justify-center font-OpenSans text-[15px] leading-[16px] cursor-pointer font-bold text-center overflow-hidden whitespace-nowrap">
                                    회원 목록
                                </div>
                                <div 
                                onClick={() => {setBoardToggle(true)}}
                                className="w-[118px] h-[32px] text-[#FFFFFF] bg-[#3578FF] rounded-[8px] flex items-center justify-center font-OpenSans text-[15px] leading-[16px] cursor-pointer font-bold text-center overflow-hidden whitespace-nowrap">
                                    글쓰기
                                </div>
                            </div>
                        </>
                        ):(
                        <>
                        {alreadySubmit ? (
                            <div className="w-[118px] h-[32px] text-[#FFFFFF] bg-[#3578FF] rounded-[8px] flex items-center justify-center font-OpenSans text-[15px] leading-[16px] cursor-pointer font-bold text-center overflow-hidden whitespace-nowrap">
                            대기중
                            </div>
                        ):
                        (
                            <div onClick={() => {handleAdmissionToggle(true)}} className="w-[118px] h-[32px] text-[#FFFFFF] bg-[#3578FF] rounded-[8px] flex items-center justify-center font-OpenSans text-[15px] leading-[16px] cursor-pointer font-bold text-center overflow-hidden whitespace-nowrap">
                                가입하기
                            </div>
                        )}
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
            <h2 className="m-2 mt-4 text-2xl font-semibold text-gray-700">게시글</h2>
            {/* Divider */}
            <hr className="mb-4 border-gray-300" />
            <div>
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
            
            {isCircleMember &&
                <button
                    onClick={() => {setBoardToggle(true)}}
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none"
                    aria-label="Floating Button"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    version="1.1"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    >
                    <g>
                        <path
                        d="M2.37988,11.9976L2,11.9976C0.899902,11.9976,0,12.8976,0,13.9976L0,17.9976C0,19.0975,0.899902,19.9976,2,19.9976L18,19.9976C19.1001,19.9976,20,19.0975,20,17.9976L20,13.9976C20,12.8976,19.1001,11.9976,18,11.9976L11.5498,11.9976L10.23,13.3076C9.8501,13.6875,9.37988,13.9675,8.87012,14.1276L4.56982,15.4176C3.52002,15.7275,2.3999,15.1276,2.08008,14.0675C1.97021,13.6875,1.97021,13.2676,2.1001,12.8876L2.37988,11.9976ZM16.6499,0.9375C17.8999,2.19751,17.8999,4.23755,16.6499,5.49756L9.52002,12.6075C9.25977,12.8676,8.93994,13.0576,8.58008,13.1676L4.29004,14.4575C3.75977,14.6176,3.2002,14.3175,3.04004,13.7876C2.97998,13.5875,2.99023,13.3876,3.0498,13.1875L4.41016,8.96753C4.52002,8.61755,4.70996,8.3175,4.95996,8.05762L12.0898,0.9375C13.3501,-0.3125,15.3901,-0.3125,16.6499,0.9375Z"
                        fill="#EDEDED"
                        />
                    </g>
                    </svg>
                </button>
            }
            {
            admissionToggle && (
                <ModalWrapper isOpen={admissionToggle} onClose={() => setAdmissionToggle(false)}>
                    <AdmissionCreate circleId={circleId} questions={questions} onclose={() => setAdmissionToggle(false)} />
                </ModalWrapper>
            )
            }
            {
                boardToggle && (
                    <ModalWrapper isOpen={boardToggle} onClose={() => setBoardToggle(false)} isTransparent={true}>
                        <BoardEditor circleId={circleId} onClose={() => setBoardToggle(false)}/>
                    </ModalWrapper>
                )
            }
    </div>
  );
};

export default CircleDetailPage;
