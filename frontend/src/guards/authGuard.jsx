"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

export const AuthGuard = ({
  children,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!router || isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && isAuthenticated) return <>{children}</>;
};
