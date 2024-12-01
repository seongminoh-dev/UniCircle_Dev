"use client";
import { useRecoilState } from "recoil";
import {
  certState,
  initializedState,
  corporationState,
} from "@/stores/automation";
import { memo, useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function InitState() {
  const [initialized, setInitialized] = useRecoilState(initializedState);

  useEffect(() => {
    // 최초 한 번만 실행되는 초기화 함수
    if (!initialized) {
      initializeRecoilRoot();
      setInitialized(true);
    }
  }, [initialized, setInitialized]);

  const initializeRecoilRoot = () => {
    // RecoilRoot 내에서 한 번만 실행되어야 하는 코드
    console.log("RecoilRoot initialized");
  };

  return <></>;
}
