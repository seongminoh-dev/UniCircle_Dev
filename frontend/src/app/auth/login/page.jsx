"use client";
import styles from "@/styles/login.module.scss";
import { Loading } from "@/components";
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
  ) : (
    <div className={styles.bg}>
      <div className={styles.frame}>
        {loginStatus !== "loading" && loginStatus !== "success" && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <span className={styles.welcome}>환영합니다</span>
            <span className={styles.smallText}>계정으로 로그인하기</span>
            <div className={styles.inputWrapper}>
              <input
                id="idInput"
                type="text"
                value={id}
                onChange={(event) => {
                  //영어만 입력받기
                  setId(event.target.value.replace(/[^A-Za-z]/gi, ""));
                }}
                placeholder="계정"
                className={`${styles.input} ${styles.englishInput} ${
                  errorMessage && styles.error
                }`}
                required
              />
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.6129 4.00493C3.6129 1.79307 5.57707 0 8 0C10.4229 0 12.3871 1.79307 12.3871 4.00493C12.3871 6.2168 10.4229 8.00987 8 8.00987C5.57707 8.00987 3.6129 6.2168 3.6129 4.00493ZM8 1.41351C6.43222 1.41351 5.16129 2.57373 5.16129 4.00493C5.16129 5.43614 6.43222 6.59636 8 6.59636C9.56778 6.59636 10.8387 5.43614 10.8387 4.00493C10.8387 2.57373 9.56778 1.41351 8 1.41351Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.87097 10.8369C2.58824 10.8369 1.54839 11.7862 1.54839 12.9571V14.0769C1.54839 14.094 1.56192 14.1085 1.58036 14.1112C5.83197 14.7449 10.168 14.7449 14.4196 14.1112C14.4381 14.1085 14.4516 14.094 14.4516 14.0769V12.9571C14.4516 11.7862 13.4118 10.8369 12.129 10.8369H11.7772C11.75 10.8369 11.7229 10.8408 11.6971 10.8485L10.8036 11.1148C8.98187 11.6579 7.01813 11.6579 5.19637 11.1148L4.30294 10.8485C4.27707 10.8408 4.25004 10.8369 4.22283 10.8369H3.87097ZM0 12.9571C0 11.0055 1.73309 9.42338 3.87097 9.42338H4.22283C4.41328 9.42338 4.60252 9.45087 4.78356 9.50483L5.67699 9.77115C7.18645 10.2211 8.81355 10.2211 10.323 9.77115L11.2164 9.50483C11.3975 9.45087 11.5867 9.42338 11.7772 9.42338H12.129C14.2669 9.42338 16 11.0055 16 12.9571V14.0769C16 14.7867 15.4365 15.3919 14.6691 15.5063C10.2523 16.1646 5.74772 16.1646 1.33086 15.5063C0.563493 15.3919 0 14.7867 0 14.0769V12.9571Z"
                  fill="black"
                />
              </svg>
            </div>
            <section className={styles.inputSection}>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호"
                  className={`${styles.input} 
                  ${errorMessage != "" && styles.error && styles.error}`}
                  required
                />
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 15 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.53796 5.48093L2.88102 8.5685L2.1868 8.62392C1.2187 8.7012 0.428201 9.42894 0.271268 10.3873C-0.0904227 12.5962 -0.0904228 14.8493 0.271268 17.0582C0.428201 18.0166 1.2187 18.7443 2.1868 18.8216L3.68293 18.941C6.04507 19.1296 8.41849 19.1296 10.7806 18.941L12.2768 18.8216C13.2449 18.7443 14.0354 18.0166 14.1923 17.0582C14.554 14.8493 14.554 12.5962 14.1923 10.3873C14.0354 9.42894 13.2449 8.7012 12.2768 8.62392L11.5824 8.56849L11.9255 5.48093C11.9659 5.11696 11.9659 4.74962 11.9255 4.38564L11.9027 4.18074C11.6612 2.00735 9.95264 0.287695 7.78085 0.0321904C7.41603 -0.0107301 7.04743 -0.0107301 6.6826 0.0321904C4.51082 0.287695 2.80221 2.00735 2.56073 4.18074L2.53796 4.38564C2.49752 4.74962 2.49752 5.11696 2.53796 5.48093ZM7.60559 1.52192C7.3572 1.49269 7.10625 1.49269 6.85786 1.52192C5.37924 1.69587 4.21597 2.86667 4.05155 4.34639L4.02879 4.55129C4.00058 4.80517 4.00058 5.0614 4.02879 5.31529L4.37759 8.45448C6.27839 8.33257 8.18506 8.33257 10.0859 8.45447L10.4347 5.31529C10.4629 5.0614 10.4629 4.80517 10.4347 4.55129L10.4119 4.34639C10.2475 2.86667 9.08422 1.69587 7.60559 1.52192ZM7.23175 12.2228C6.40332 12.2228 5.73175 12.8943 5.73175 13.7228C5.73175 14.5512 6.40332 15.2228 7.23175 15.2228C8.06018 15.2228 8.73175 14.5512 8.73175 13.7228C8.73175 12.8943 8.06018 12.2228 7.23175 12.2228Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className={styles.inputWrapper}>
                {errorMessage && (
                  <span className={styles.warning}>{errorMessage}</span>
                )}
              </div>
            </section>
            <button className={styles.bottomButton} value="로그인" type="submit">로그인</button>
            <div className={styles.bottomWrapper}>
              <span className={styles.bottomText}>
                아직 회원가입을 하지 않으셨나요?
              </span>
              <button
                className={styles.bottomButton}
                onClick={() => alert("유선상 문의 부탁드립니다.")}
              >
                회원가입하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
