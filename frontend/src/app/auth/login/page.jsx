"use client";
import styles from "@/styles/login.module.scss";
import { Loading, Header, LoginForm } from "@/components";
import { useEffect, useState } from "react";
import {
  Login,
  setCookie,
  checkUserAuthentication,
} from "@/services";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { initializedState } from "@/stores";
import { useAuth } from "@/hooks";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  //로그인
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  // 로그인 상태
  const [loginStatus, setLoginStatus] = useState("idle");
  const { isLoading: isAuthLoading, isStaff, isAuthenticated } = useAuth();

  // 로그인 실패 에러 메시지
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [initialized, setInitialized] = useRecoilState(initializedState);

  // 로그인 되어있으면 테이블 페이지로 이동
  useEffect(() => {
    const isUserValid = async () => {
      if (isAuthLoading) return;
      if (isAuthenticated && isStaff)
        if ((await checkUserAuthentication()) === true) {
          setInitialized(false);
          router.push("/board");
        } else setIsLoading(false);
      else if (isAuthenticated && !isStaff) router.push("/board");
      else setIsLoading(false);
    };
    isUserValid();
  }, [isAuthLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoginStatus("loading");
      const res = await auth.signIn({
        login_id: id,
        password: password,
      });

      if (res && res.token.access && res.token.refresh) {
        setLoginStatus("success");
        router.push("/board");
      }
    } catch (error) {
      // 로그인 실패 메시지 출력
      console.log("Login error:", error);
      setLoginStatus("error");
      setErrorMessage("아이디/비밀번호를 확인해주세요.");
    }
  };

  return isLoading ? (
    <div className={styles.frame} style={{ width: "100vw" }}>
      <Loading />
    </div>
  ) :(
    <div className="min-h-screen flex flex-col">
      {/* 상단에 고정된 헤더 */}
      <Header />
      {/* 중앙에 배치된 로그인 폼 */}
      <div className="flex-grow flex items-start justify-center mt-16">
        <LoginForm />
      </div>
    </div>
  )
};

export default LoginPage;
