import { atom } from "recoil";

export const initializedState = atom({
  key: "initializedState",
  default: false, // 초기값은 false로 설정
});
