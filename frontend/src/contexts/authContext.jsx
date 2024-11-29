"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  Login,
  Logout,
  getCookie,
  setCookie,
} from "@/services";
import { checkToken,decodeToken } from "@/services/Token";

//핸들러 정의
const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

//초기 상태
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};


const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;
    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: false,
  user: { userId: '', role: '' },
  signIn: () => {},
  signOut: () => {},
});

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  // 초기화
  const initialize = async () => {
    // React.StrictMode로 인해 두 번 호출되는 것을 방지
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    // 초기 설정 부분
    try{
      // Access_Token의 존재 여부 확인
      const accessToken = await getCookie('access_token');
      // 토큰이 없으면 로그 아웃 처리
      if(!accessToken){
        dispatch({
          type: HANDLERS.SIGN_OUT,
        });
      }
      // 토큰이 있으면 유효성 검사
      const tokenValid = await checkToken();
      // 토큰이 유효하면 사용자 정보를 설정, 유효하지 않은 토큰이면 로그아웃 처리
      if (tokenValid){
        const decodedToken = await decodeToken();
        const user = {
          userId: decodedToken.email,
          role: decodedToken.role,
        };
        dispatch({ type: HANDLERS.INITIALIZE, payload: user });
      } else {
        dispatch({ type: HANDLERS.SIGN_OUT });
      }
      }catch(err){
        console.error('인증 초기화 중 오류 발생:', err);
        dispatch({ type: HANDLERS.SIGN_OUT });
      }
  };

  // 초기화
  useEffect(() => {
    initialize();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      // 서버로 로그인 요청
      const { accessToken, refreshToken } = await Login({ email, password });
      // 쿠키 저장
      await setCookie("access_token", accessToken, { maxAge: 86400 }); // 하루(1일) 유효
      await setCookie("refresh_token", refreshToken, { maxAge: 86400 });
      // 토큰 해독 후 사용자 정보 추출
      const decodedToken = await decodeToken();
      const user = {
        userId: decodedToken.email,
        role: decodedToken.role,
      };
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
      return user;
    } catch (error) {
      console.error("로그인 오류 입니다: ", error.message);
      throw new Error("아이디 / 비밀번호를 확인해주세요.");
    }
  };

  const signOut = async () => {
    await Logout();
    window.sessionStorage.removeItem('authenticated');
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
    console.log(value);
  };

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const AuthConsumer = AuthContext.Consumer;
