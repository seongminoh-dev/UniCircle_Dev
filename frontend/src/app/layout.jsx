import { Inter } from "next/font/google";
import "./global.css"; // 전역 스타일
import { AuthProvider } from "@/contexts/authContext";
import { AuthGuard } from "@/guards/authGuard";
import RecoilRootProvider from "./recoilRootProvider";

const inter = Inter({ subsets: ["latin"] });

//헤더, 푸터, 네비게이션 바 및 전역 스타일을 정의
export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <RecoilRootProvider>{children}</RecoilRootProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
