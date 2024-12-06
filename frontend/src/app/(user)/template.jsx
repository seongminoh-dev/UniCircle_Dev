"use client";

import { AuthGuard } from "@/guards/authGuard";
import { useAuth } from "@/hooks";
import { Loading } from "@/components";
import {Header, LeftSidebar, RightSidebar} from "@/components";

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
            <div className="h-screen flex flex-col">
              <Header />
              <div className="flex flex-grow overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar />
  
                {/* Scrollable children */}
                <div className="bg-neutral-50 rounded-lg m-4 p-2 space-y-4 flex-grow overflow-y-auto">
                  {children}
                </div>
  
                {/* Right Sidebar */}
                <RightSidebar />
              </div>
            </div>
          </>
        )}
      </>
    );
  }