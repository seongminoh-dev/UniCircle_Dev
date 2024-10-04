"use client";
import { jwtDecode } from "jwt-decode";
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
  checkUserAuthentication,
  getCookie,
  setCookie,
} from "@/services";
import { useRouter } from "next/navigation";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  NOT_STAFF: "NOT_STAFF",
};

const initialState = {
  isAuthenticated: false,
  isStaff: false,
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
            isStaff: user.is_staff,
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
      isStaff: user.is_staff,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      isLoading: false,
      isStaff: false,
      user: null,
    };
  },
  [HANDLERS.NOT_STAFF]: (state) => {
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      isStaff: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: false,
  isStaff: false,
  user: { nickName: '' },
  signIn: () => {},
  signOut: () => {},
});

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const initialized = useRef(false);

  const initialize = async () => {
    // React.StrictMode로 인해 두 번 호출되는 것을 방지
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    let tokenValid = false;
    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      tokenValid = await checkUserAuthentication();
    }

    if (isAuthenticated && tokenValid) {
      try {
        const accessToken = await getCookie('access_token');
        if (!accessToken) throw new Error('토큰이 없습니다.');

        // 토큰 해독
        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.is_staff === false) {
          throw new Error('관리자만 접근 가능합니다.');
        }
      } catch (error) {
        console.error('JWT 토큰 해독 오류:', error);
        dispatch({
          type: HANDLERS.NOT_STAFF,
        });
        return;
      }

      const nickName = localStorage.getItem('nickName');
      const user = {
        nickName: nickName || '',
        is_staff: true,
      };
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    }
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async ({ login_id, password }) => {
    const res = await Login({ login_id, password });
    if (res.token.access && res.token.refresh) {
      try {
        // // 토큰 해독
        // const decodedToken = jwtDecode(res.token.access);

        // if (decodedToken.is_staff === false) {
        //   throw new Error('관리자만 접근 가능합니다.');
        // }

        window.sessionStorage.setItem('authenticated', 'true');
        // 쿠키 만료 기간 (예: 1일로 설정)
        await setCookie('access_token', res.token.access, { maxAge: 86400 });
        await setCookie('refresh_token', res.token.refresh, { maxAge: 86400 });
      } catch (err) {
        console.error(err);
      }
    } else {
      throw new Error('아이디 / 비밀번호를 확인해주세요.');
    }

    const user = {
      is_staff: true,
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
    return res;
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
