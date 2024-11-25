"use client";

import { AuthGuard } from "@/guards/authGuard";
import { useAuth } from "@/hooks";
import { Loading } from "@/components";
import {Header, LeftSidebar, RightSidebar, SearchBar} from "@/components";

const SplashScreen = () => {
    return (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#fff",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          left: 0,
          position: "fixed",
          right: 0,
          top: 0,
        }}
      >
        <Loading />
      </div>
    );
  };

export default function Template({ children }) {
    const auth = useAuth();
  
    return (
      <>
        {auth && auth.isLoading ? (
          <SplashScreen />
        ) : (
          <>
            {/*<AuthGuard>*/}
            <div>
              <Header/>
              <div className="z-10 min-h-screen flex space-x-4">
                <LeftSidebar />
                <div className="h-screen flex flex-col flex-1 p-4 ">
                  <SearchBar/>
                  {/* 내용물(children) 목록 스크롤 가능 영역 */}
                  <div className="overflow-y-auto p-4 space-y-4 flex-grow">
                    {children}
                  </div>
                </div>
                <RightSidebar />
              </div>
            </div>
            {/*</AuthGuard>*/}
          </>
        )}
      </>
    );
  }