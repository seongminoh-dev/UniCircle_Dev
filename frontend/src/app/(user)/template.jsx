"use client";

import { AuthGuard } from "@/guards/authGuard";
import { useAuth } from "@/hooks";
import { Loading } from "@/components";

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
            <AuthGuard>
              <>{children}</>
            </AuthGuard>
          </>
        )}
      </>
    );
  }