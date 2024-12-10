# University Of Seoul - Software Engineering Project

<br>

## 목차 (Table of Contents)
- [Project Title - UniCircle](#project-title---unicircle)
- [Project Scope](#-project-scope)
- [Project Duration](#-project-duration)
- [Highlight Features](#-highlight-features)
- [Project Constraints](#️-project-constraints)
- [High Level Architecture](#️-high-level-architecture)
- [Technology Stack](#-technology-stack)
- [Installation Guideline](#️-installation-guideline)
- [Project Deliverables](#%EF%B8%8F-project-deliverables)
- [Repository Structure (Directory Roles)](#-repository-structure-directory-roles)
- [Project Team Members](#project-team-members)

  
---

## Project Title - UniCircle 
**UniCircle**: Uni(versity) + Circle(동아리)를 합쳐 만든 **학교 동아리 통합 관리 및 커뮤니티 플랫폼**

<br>

---

## 🎯 Project Scope  
서울시립대학교 컴퓨터과학부 2024년 소프트웨어 공학 프로젝트로, **Software Development Life-Cycle** 을 기반으로 **객체지향 소프트웨어공학 방법론**을 적용하여 **웹을 기반으로 한 서울시립대학교 동아리 통합 플랫폼**을 개발합니다.

**주요 기능**:  
- 동아리 통합 관리  
- 회원 관리 (가입/로그인/입부 신청 등)  
- 게시판 (게시글 / 댓글) 관리  
- 해시태그 기반 동아리 및 게시글 검색 기능

<br>

---

## ⏰ Project Duration  
**2024년 2학기**

<br>

---

## 🌟 Highlight Features

1. **회원 관리**  
   - 이메일을 통한 회원가입 및 로그인 기능 제공  
   - 비밀번호 재설정 및 회원 탈퇴 기능 지원  
   - JWT 기반 인증으로 안전한 세션 유지

2. **동아리 관리**  
   - 동아리 개설 및 소개 페이지 제작 기능  
   - 동아리별 입부 신청서 작성 및 관리 지원  
   - 동아리 해시태그 등록 및 관리

3. **동아리 회원 관리**  
   - 입부 희망자의 신청서 접수 및 조회  
   - 동아리 관리자의 입부 수락 또는 거절 기능  
   - 동아리원 목록 관리 및 정보 업데이트

4. **게시판 관리**  
   - 게시글 작성, 수정, 삭제 및 댓글 기능 지원  
   - 공개 범위(전체/동아리원 전용) 설정 가능  
   - 해시태그를 통한 게시글 분류 및 검색

5. **해시태그 기반 동아리 검색**  
   - 관심 분야(예: #농구, #밴드)에 맞추어 동아리 검색  


<br>

### Demo Video

https://github.com/user-attachments/assets/8d27f868-d3b4-411b-87a5-fdba4d5544fa

<br>

---

## ⚙️ Project Constraints  
- **기술적 제약:** 웹 기반 우선 개발, 제한된 서버 리소스, 초기 성능 최적화 필요  
- **보안/프라이버시:** 개인정보 보호법 준수, JWT 기반 인증 고려  
- **일정 제약:** 2025년 겨울학기 종료 전 1차 릴리즈 완료  
- **비용 제약:** 제한된 예산 내에서 클라우드/DB 사용  
- **사용자 수 제약:** 초기 약 1,000명 규모의 사용자 대응

<br>

---

## ⚙️ High Level Architecture

<img width="452" alt="image" src="https://github.com/user-attachments/assets/e79d1084-851b-4ef3-a25d-437b65b756e1">

UniCircle는 3-Tier 아키텍처를 적용하여 Presentation Layer(프론트엔드), Application Logic Layer(백엔드), 그리고 Data Layer(데이터베이스)로 구성됩니다.

#### Tier 1: Presentation Layer
- **기술:** Next.js  
- **역할:**
  - 사용자 인터페이스(UI) 제공  
  - 사용자의 입력 데이터를 수집하고, 결과를 시각적으로 표현  
  - REST API를 통해 Tier 2(Spring 서버)와 통신  
  - **예:** 동아리 목록 조회 화면, 특정 동아리 정보 입력 폼 등

#### Tier 2: Application Logic Layer
- **기술:** Spring Framework  
- **역할:**
  - 비즈니스 로직 처리 (회원가입, 동아리 관리, 게시판 기능 등)
  - 데이터 검증, 인증, 권한 관리 수행
  - Tier 3(PostgreSQL)와 직접 통신하여 필요한 데이터 조회/저장
  - **예:** 사용자가 제출한 동아리 정보 검증 후, 데이터베이스에 저장 로직 수행

#### Tier 3: Data Layer
- **기술:** PostgreSQL  
- **역할:**
  - Application Layer의 요청에 따른 데이터 저장, 수정, 삭제, 조회  
  - 데이터 무결성과 일관성 유지  
  - **예:** 동아리 정보, 유저 정보, 게시글, 댓글, 해시태그 등의 데이터 영구 저장 및 관리

<br>

### 동작 흐름 예시

1. **Tier 1 (Presentation Layer)**: 사용자가 Next.js 웹 화면에서 동아리 질문을 입력하고 **"저장"** 버튼 클릭  
2. **Tier 2 (Application Logic Layer)**: 입력 데이터가 REST API를 통해 Spring 서버로 전달 → 서버는 데이터 유효성 검사 후 비즈니스 로직 처리  
3. **Tier 3 (Data Layer)**: Spring 서버에서 PostgreSQL에 새로운 질문 데이터를 저장 혹은 기존 데이터 업데이트  
4. **응답 반환 흐름 (Tier 3 → Tier 2 → Tier 1)**: PostgreSQL로부터 응답 데이터를 받은 Spring 서버가 이를 프론트엔드(Next.js)에 반환 → 사용자는 화면에서 처리 결과 확인
   
<br>

---

## 💻 Technology Stack  
- **Frontend:** Next.js  
- **Backend:** Java Spring  
- **Database:** Postgres  
- **Infrastructure:** AWS

<br>

---

## 🛠️ Installation Guideline

1. **Frontend 빌드/실행**  
   ```bash
   cd frontend
   npm install
   npm run dev  # http://localhost:3000 에서 확인
   ```

   <br>
   
2. **Backend 빌드/실행**
   - Docker 및 EC2 자동배포 설정 완료
   - Backend는 Docker 이미지를 빌드한 뒤, AWS EC2 인스턴스에 자동으로 배포되도록 구성되어 있습니다.
  
   로컬 개발용 Backend 실행 (선택 사항)
   ```bash
   cd backend
   ./gradlew build
   ./gradlew bootRun  # http://localhost:8080 에서 확인
   ```

   실서비스 환경:
   로컬 환경에서 Docker 기반 CI/CD 파이프라인을 통해 이미지를 빌드하고, 이를 EC2 환경으로 자동 배포
   애플리케이션 실행 시 EC2 퍼블릭 IP 및 지정된 포트를 통해 Backend API에 접근 가능

<br>

---

## 🖥️ Project Deliverables  

- 요구사항 분석 명세서 final version: <<링크>>  
- Architecture 및 Design Documents  
  - Software architecture: <<관련 문서 링크>>  
  - Software Design: <<관련 문서 링크>>  
  - UI Design: <<관련 문서 링크>>  
- Coding Standard: <<관련 문서 링크>>

- **Code**  
  ### Branch 구조 및 역할
  - **`master`**  
    - 사용자에게 배포 가능한 상태를 관리  
    - 제품으로 출시 가능한 안정적인 브랜치  
  - **`develop`**  
    - 다음 출시 버전을 개발하는 브랜치  
    - 새로운 기능이 추가되고 버그가 수정되면 `develop`에서 `main`으로 병합  
    - 모든 개발은 `develop` 브랜치를 기반으로 진행  
  - **`feature/{scope}/{issue}`**  
    - 새로운 기능 개발 또는 버그 수정을 위해 `develop`에서 분기  
    - 개발 완료 후 `develop` 브랜치로 병합  
    - 예: `feature/front/auth`, `feature/back/board`

  ### 현재 프로젝트 브랜치  
  - `master`  
    - 사용자 배포용 상태를 관리하는 브랜치  
  - `Design`  
    - UI 및 디자인 관련 작업 관리  
  - `feature/back/auth`  
    - 백엔드 인증 관련 기능 개발 브랜치  
  - `feature/back/board`  
    - 백엔드 게시판 기능 개발 브랜치  
  - `feature/back/circle`  
    - 백엔드 동아리 관리 기능 개발 브랜치  
  - `feature/front/auth`  
    - 프론트엔드 인증 관련 기능 개발 브랜치  
  - `feature/front/board`  
    - 프론트엔드 게시판 기능 개발 브랜치  
  - `feature/front/circle-management`  
    - 프론트엔드 동아리 관리 기능 개발 브랜치  
  - `feature/front/service`  
    - 프론트엔드 서비스 및 기타 기능 개발 브랜치  

- 테스트 케이스 및 결과  
  JUnit을 활용하여 약 50개의 기능 테스트 작성  
  - 모든 테스트 성공 (100% 성공률)  
  - 주요 테스트 항목:  
    - 회원가입 및 로그인 로직 검증  
    - 게시판 CRUD 기능 테스트  
    - 동아리 생성 및 관리 기능 검증  
    - JWT 인증 및 권한 확인 테스트  
  - 테스트 보고서: <<테스트 로그 링크>>  


<br>

---

## 📂 Repository Structure (Directory Roles)

### Frontend
- app/: Next.js 라우팅 구조를 담고 있으며, 각 페이지(사용자 관련 페이지, 동아리 상세/검색 페이지 등)를 관리
- components/: 재사용 가능한 UI 컴포넌트(헤더, 사이드바, 게시글 편집기 등) 모음
- contexts/: 전역 상태 관리를 위한 Context API 정의
- define/: 공통 타입 정의나 상수 관리
- guards/: 인증 및 권한 확인 로직(가드) 관리
- hooks/: 커스텀 훅(Hook) 정의
- services/: API 통신 로직(입부 신청, 게시글, 댓글, 해시태그 등)
- stores/: 전역 상태 관리를 위한 Recoil, 혹은 전역 스토어 설정 관리
- styles/: 전역 또는 모듈 단위 스타일 파일 관리 (SCSS/CSS)

<br>

### Backend
- config/: 보안 설정, JWT 필터, 오픈 API 설정 등 환경 및 보안 관련 설정 파일
- controller/: REST API 엔드포인트 담당, 클라이언트 요청을 받고 응답 처리
- dto/: 데이터 전송 객체(요청/응답용) 정의
- entity/: DB 테이블과 매핑되는 JPA 엔티티 클래스 정의
- repository/: JPA Repository 인터페이스, 데이터베이스 접근 로직
- service/: 비즈니스 로직 구현 (동아리 관리, 게시판 기능, 해시태그 처리, 인증 등)
- util/: 유틸리티 클래스(JWT 생성/파싱, 공용 기능) 관리
- resources/: 애플리케이션 설정 파일(yml), 정적 파일(static), 템플릿 등

<br>

---

## Project Team Members

| Name           | Role                | Github                 |
|----------------|---------------------|-----------------------|
| 박세환(프론트엔드 팀장) | Frontend Developer  | [박세환 깃허브 Profile](https://github.com/sehwan505) |
| 배유찬 | Frontend Developer  | [배유찬 깃허브 Profile](https://github.com/baeyc0510) |
| 오승민 | Frontend Developer  | [오승민 깃허브 Profile](https://github.com/seongminoh-dev) |
| 주재원(백엔드 팀장)  | Backend Developer   | [주재원 깃허브 Profile](https://github.com/jaewon-ju) |
| 김동하  | Backend Developer   | [김동하 깃허브 Profile](https://github.com/H4N9ER) |
| 김민회  | Backend Developer   | [김민회 깃허브 Profile](https://github.com/LNemo) |



