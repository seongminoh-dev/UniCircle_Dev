"use client";
import { useRecoilState } from "recoil";
import {
  certState,
  initializedState,
  corporationState,
} from "@/stores/automation";
import { getCert } from "@/services/automation";
import { memo, useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function InitState() {
  const [corporationName, setCorporationName] =
    useRecoilState(corporationState);
  const [isCert, setIsCert] = useRecoilState(certState);
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
    // 여기에 Recoil 상태 초기화 또는 다른 초기화 코드를 추가할 수 있습니다.

    const checkCert = async () => {
      await getCert()
        .then(() => {
          setIsCert(true);
        })
        .catch((e) => {
          setIsCert(false);
        });
    };
    checkCert();
    const corporationName = localStorage.getItem("corporationName");
    if (corporationName) setCorporationName(corporationName);
  };

  return <></>;
}
