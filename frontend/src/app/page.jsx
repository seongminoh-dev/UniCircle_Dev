"use client";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, isStaff } = useAuth();

  useEffect(() => {
    if (router) {
      if (!isLoading)
        if (!isAuthenticated) router.push("/auth/login");
        else if (!isStaff && isAuthenticated) router.push("/board");
        else if (isStaff && isAuthenticated)
          router.push("/board");
    }
  }, [isLoading]);

  return <></>;
};

export default Page;
