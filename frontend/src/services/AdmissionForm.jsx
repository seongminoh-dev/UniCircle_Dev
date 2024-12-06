"use server";

import { getAccessToken } from "./Token";

// 입부 신청서 작성 함수(테스트완)
export async function sendAdmissionForm({ circleId, userId, formContent }) {
    console.log("Circle", circleId, userId, formContent);
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/create`;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken,
        },
        body: JSON.stringify({ 
            circleId, 
            userId, 
            formContent : JSON.stringify(formContent)
        }),
      });
      if (response.status === 200) {
        return ;
      } else {
        throw new Error(`Fail to send admission form: ${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error:", error.message);
      throw error;
    }
  }

  // formId로 입부 신청서 불러오기(테스트완)
  export const getAdmissionForm = async (formId) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/content/${formId}`;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          "Authorization": accessToken,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Admission Form이 존재하지 않습니다:${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in getAdmissionForm", error.message);
      throw error;
    }
  };

  // formId로 입부 신청서 삭제
  export const deleteAdmissionForm = async (formId) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/delete/${formId}`;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(URL, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          "Authorization": accessToken,
        },
      });
      if (response.status === 200) {
        return ;
      } else {
        throw new Error(`Admission Form 삭제 실패:${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in deleteAdmissionForm", error.message);
      throw error;
    }
  };

  // circleId로 모든 입부 신청서 검색
  export const getAllFormByCircleId = async (circleId) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/searchcircle/${circleId}`;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          "Authorization": accessToken,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Circle이 존재하지 않습니다:${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in getAllFormByCircleId", error.message);
      throw error;
    }
  };

  // userId로 모든 입부 신청서 검색
  export const getAllFormByUserId = async (userId) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/searchuser/${userId}`;
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          "Authorization": accessToken,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`User가 존재하지 않습니다:${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in getAllFormByUserId", error.message);
      throw error;
    }
  };

  // formId의 입부 신청서 내용 수정
  export async function updateAdmissionForm({ formId, circleId, userId, formContent }) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/updatecontent/${formId}`;
    try {
      const accessToken = await getAccessToken(); // Access Token 가져오기
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken,
        },
        body: JSON.stringify({
          circleId,
          userId,
          formContent: JSON.stringify(formContent),
        }),
      });
  
      if (response.status === 200) {
        return;
      } else {
        throw new Error(`Admission Form 업데이트 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in updateAdmissionForm", error.message);
      throw error;
    }
  }
  
  // formId의 status 변경 REJECTED/PENDING/ACCEPTED
  export async function updateAdmissionFormStatus({ formId, status }) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/updatestatus/${formId}/${status}`;
    try {
      const accessToken = await getAccessToken(); // Access Token 가져오기
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Authorization": accessToken,
        },
      });
      if (response.status === 200) {
        return;
      } else {
        throw new Error(`Admission Form Status 업데이트 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in updateAdmissionForm", error.message);
      throw error;
    }
  }

  export async function acceptUserByFormId(formId) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}forms/accept/${formId}`;
    try {
      const accessToken = await getAccessToken(); // Access Token 가져오기
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Authorization": accessToken,
        },
      });
  
      if (response.status === 200) {
        return; // 성공 시 추가 작업 필요 없음
      } else {
        throw new Error(`Admission Form 승인 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("Unknown Error in acceptUseByFormId", error.message);
      throw error; // 예외를 다시 던져 호출자가 처리
    }
  }
