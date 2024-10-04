"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

export const AuthGuard = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, isStaff } = useAuth();

  useEffect(() => {
    if (!router || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    if (!isStaff) {
      router.replace("/board");
      return;
    }
  }, [isLoading, isAuthenticated]);

  if (!isLoading && isAuthenticated && isStaff) return <>{children}</>;
};
