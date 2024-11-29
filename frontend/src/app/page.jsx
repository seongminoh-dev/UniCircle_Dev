"use client";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (router) {
      if (!isLoading)
        if (!isAuthenticated) router.push("/auth/login");
        else router.push("/boards/related");
    }
  }, [isLoading]);

  return <></>;
};

export default Page;
