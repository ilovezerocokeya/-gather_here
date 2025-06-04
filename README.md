## 💻 @gather_here

<img src="https://github.com/user-attachments/assets/4d63e8b7-789a-4512-8b70-78a2ad71565f" alt="gather_here 대표이미지" width="800px" />

## 📖 소개 및 개요

#### <img src="https://github.com/user-attachments/assets/42e201d2-f6e9-4269-bd09-37108d5f649e" alt="frontend" style="width: 16px; vertical-align: middle; margin-right: 5px;"/> 서비스 소개 <img src="https://github.com/user-attachments/assets/855c502b-ea52-4f41-b94a-3d1763eee7b9" alt="frontend" style="width: 16px; vertical-align: middle; margin-right: 5px;"/>

- 배포 URL : [🔗 @gather_here](https://www.gatherhere.dev/all)
- `@gather_here`는 개발자, 디자이너, 기획자 등 9개의 IT 직군 종사자들과 IT 직군 취업을 준비하는 사용자들을 연결해주는 플랫폼입니다.
- 회원가입 시 한 번의 설문으로 나의 정보를 등록하여 서비스를 편리하게 이용할 수 있습니다.
- 원하는 사이드 프로젝트나 IT스터디 멤버를 모집하기 위해 게시글을 작성할 수 있으며, **지역 또는 유형별 필터링**으로 게시물을 탐색할 수 있습니다.
- 북마크 기능을 통해 관심 있는 게시글을 저장하고, 내가 작성한 글과 함께 마이페이지에서 확인할 수 있습니다.
- 사용자는 오픈채팅 또는 기재된 연락처를 통해 적합한 팀원과 직접 소통하며 프로젝트를 진행할 수 있습니다.
- HUB 페이지에서는 나의 정보를 PR 카드 형태로 등록하고, 스터디나 프로젝트 동료를 찾을 수 있습니다.

## ✨ @gather_here 구경하기

<details>
<summary>목차</summary>
   
- [팀 소개](#teamintro)
- [아키텍쳐](#architecture)
- [ERD](#erd)
- [주요 기술](#skill)
- [기술적 의사결정](#technical)
- [프로젝트 구조](#structure)
- [UI](#ui)

</details>

## <h3 id="teamintro">1.📢 팀 소개</h3>

<p>안녕하세요! 3명의 프론트엔드 개발자와 1명의 디자이너로 구성된 <strong>게더 히어</strong>팀입니다.<br>
`게더 히어`는 각기 다른 역량을 가진 우리가 모여, 협업의 시너지를 극대화 시킨다 라는 의미를 가지고 있습니다. 🔥<br>
</p>

|                                                            👑김영범                                                            |                                                             💻조은영                                                              |                                                                   💡김성준                                                                   |                                                              🎨전정현                                                              |
| :----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|            <img src="https://github.com/user-attachments/assets/8720fef6-8ab1-4350-b9a4-068548e70e1e" width="200">             |              <img src="https://github.com/user-attachments/assets/b5f761ab-9343-4726-9a70-32e0745567dc" width="200">              |                   <img src="https://github.com/user-attachments/assets/819e65bc-ca66-4dcd-870d-80b6a4c3dbb2" width="200">                    |              <img src="https://github.com/user-attachments/assets/f394d0c9-314a-441e-8683-7f35e12f49f2" width="200">               |
| ![Team%20Leader](https://img.shields.io/badge/-Team%20leader-yellow) ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | ![Deputy%20Leader](https://img.shields.io/badge/-Deputy%20Leader-green) ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | ![WorkManagement](https://img.shields.io/badge/-Work%20Management%20leader-f67280) ![FrontEnd](https://img.shields.io/badge/FrontEnd-3f97fb) | ![Design%20Leader](https://img.shields.io/badge/-Design%20leader-purple) ![Designer](https://img.shields.io/badge/Designer-004088) |
|                                         github:<br> [kybaq](https://github.com/kybaq)                                          |                                      github:<br> [Eunyoung](https://github.com/Eunyoung-Jo)                                       |                                          github:<br> [SeongJun](https://github.com/ilovezerocokeya)                                          |                                     blog:<br> [Junghyun](https://velog.io/@yardvvorker/posts)                                      |

## <h3 id="architecture">2. 🏗 아키텍쳐</h3>

<img src="https://github.com/user-attachments/assets/48b45708-f3b6-4f25-b737-07783d6ee884" alt="image" width="800px" />

## <h3 id="erd">3. 📚 ERD</h3>

<img src="https://github.com/user-attachments/assets/af11dffe-0540-4641-acc6-5e22dfc7b066" alt="image" width="800px" />

## <h3 id="skill">4.🍀나의 주요 기여</h3>

<details>
  <summary>로그인</summary>
   
   - 소셜로그인(구글, 카카오)으로 간편하게 로그인을 할 수 있습니다.
   - 처음 소셜로그인을 하는 유저는 간단한 정보를 받습니다.
   - 이미 한번 정보를 받았던 기존의 유저의 경우에 소셜로그인을 하게되면 바로 메인페이지로 이동합니다.
   - 이러한 절차가 번거롭게 느껴지는 유저들을 위한 건너뛰기 기능은 회원에게 default data를 주어서 나중에 필요시 마이페이지에서 따로 정보를 추가할 수 있게 만들었습니다.
   - 간단한 정보를 받는 마지막 단계로서 닉네임은 필수로 받으며, 중복체크와 공백체크를 합니다.
   - 포트폴리오 주소를 저장하기 위한 URL은 선택사항으로서 작성하지 않고 넘어가면 다시 한 번 알림창으로 확인을 거치고 나서 프로필 저장을 할 수 있게 됩니다.
   - 프로필 저장을 통해서 최종적으로 DB에 유저의 정보가 저장되면 마지막 Welcome페이지를 볼 수 있습니다. 
</details>

<details>
  <summary>메인 페이지</summary>
 
- 검색기능
- 전체 / 스터디 / 프로젝트
- 게시물 리스트 :  모든 탭의 전체 게시물을 최신글 순으로 보여줌
- 사이드 요소
    - 오픈톡 : 로그인한 모든 유저들이 참여할 수 있는 채팅방입니다.
    - 멤버카드 : 본인의 정보를 등록한 유저들을 확인하고, 팀원으로 섭외할 수 있습니다.
- 스터디 / 프로젝트 / IT행사 페이지에서는 마감임박한 게시물을 캐러셀로 보여줌
- 직군 / 방식 / 지역 / 기간 필터로 사용자가 원하는 글만 선택하여 볼 수 있습니다.
- 행사 정보중 마감이 임박한 행사를 상단에서 슬라이드로 볼 수 있게 구현하였습니다.
  </details>

<details>
  <summary>글 작성 페이지</summary>

- 사용자가 사람을 구하고 싶은 스터디/ 프로젝트를 원하는 직군, 스택 등에 맞게 선택하여 작성할 수 있습니다.
- 임시저장 기능을 구현해 유저가 글쓰기 화면에서 이탈해야 할 경우 임시저장 버튼을 누른다면 이후에 글쓰기 페이지에 들어왔을때 해당 시점의 데이터를 다시 불러올 수 있게 했습니다.
- 본인이 쓴 글에서 수정하기 버튼을 누르면 작성했던 필드값 그대로 다시 작성 페이지에서 수정할 수 있습니다.

</details>

<details>
  <summary>공고 상세페이지</summary>

- 상세 페이지에서 확인하고 싶은 공고의 상세 정보들을 확인할 수 있습니다.
- 공유하기 버튼으로 url 복사를, 북마크 버튼으로 관심글 저장을 할 수 있습니다.
- 본인이 쓴 글인 경우 북마크 옆에 버튼을 따로 만들어 게시글 수정, 삭제가 가능하게 했습니다.
- 본인이 쓴 글이 아닐 경우 해당 버튼은 노출되지 않게 하였습니다.
</details>

<details>
  <summary>마이페이지</summary>

- 마이페이지 네비게이션
  - 마이페이지 내에 전용 네비게이션이 있어, 기본 프로필 / 허브 프로필 / 북마크 / 관심 글 / 작성 글을 간편하게 탐색할 수 있습니다.
- 프로필 사진 수정
  - 이미지 파일을 드래그하거나 선택해 프로필 사진을 업로드할 수 있습니다.
  - 기본으로 제공되는 기본 이미지로도 변경할 수 있습니다.
- 내 정보 수정
  - 회원가입 시 입력한 정보(닉네임, 직군, 경력, 포트폴리오 URL 등)를 마이페이지에서 자유롭게 수정할 수 있습니다.
- 허브 프로필 관리
  - PR 카드 형태로 자기소개, 기술 스택, 팀워크 질문 응답, 연락처 등을 입력할 수 있습니다.
  - 허브 프로필에 좋아요 기능이 있어, 받은 피드백을 시각적으로 확인할 수 있습니다.
  - 허브 프로필 공개 여부는 토글을 통해 직접 설정할 수 있습니다.
- 내 관심 글
  - 북마크한 게시글을 ‘스터디 / 프로젝트’ 탭으로 분류해 한눈에 확인할 수 있습니다.
- 내 관심 멤버
  - 좋아요를 누른 유저들의 허브 프로필(PR 카드)을 리스트로 확인할 수 있습니다.
- 내 작성 글
- 내가 작성한 게시글 목록을 확인할 수 있습니다.
- 각 카드에 좋아요 수가 표시되며, 카드 hover 시 수정 및 삭제 버튼이 노출되어 간편하게 관리할 수 있습니다.
</details>

<details>
  <summary>Hub 페이지</summary>

- PR 카드 리스트
  - 유저들이 등록한 PR 카드들을 카드 형태로 한눈에 확인할 수 있습니다.
  - 각 카드에는 직군, 경력, 한 줄 소개, 좋아요 수, 대화 신청 버튼 등이 표시됩니다.
- 필터 기능
  - 전체 보기와 함께, 프론트엔드 / 백엔드 / iOS / 안드로이드 / 디자이너 등 **9개의 직군별 필터**를 지원합니다.
  - 원하는 직군만 선택하여 PR 카드를 탐색할 수 있습니다.
- 페이지네이션
  - 전체 PR 카드는 페이지네이션 기반으로 구성되어 있으며, 한 번에 6개의 PR 카드를 표시합니다.
  - 페이지를 넘기며 다른 유저의 카드도 확인할 수 있습니다.
- 북마크 기능
  - 관심 있는 PR 카드를 북마크할 수 있으며, 북마크한 유저는 마이페이지에서 따로 관리할 수 있습니다.
- PR 카드 상세 모달
- PR 카드를 클릭하면, 해당 유저가 마이페이지(허브프로필)에서 작성한 상세 정보를 모달로 확인할 수 있습니다.
- 자기소개, 공통 질문 응답, 기술 스택, 포트폴리오 URL, 연락처 등 세부 정보가 포함되어 있어, 본인의 이 직군에 임하는 태도를 어필할 수 있습니다.
</details>

## <h3 id="technical">5.🧩 기술적 의사결정</h3>

### 프레임워크

<div>
  <h4>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white">
  </h4>
  <p>Next.js는 페이지 간 코드를 자동으로 분할하여 초기 로딩 시간을 줄여줍니다. 특히, Next.js의 App Router는 서버 컴포넌트를 지원하며, 기존 페이지 라우터보다 더 유연하고 다양한 기능을 제공해줍니다. 실시간 데이터 통신이 중요한 애플리케이션에서는 이 기능들이 성능 최적화에 큰 도움이 됩니다. 이러한 이유로, 동적인 데이터를 처리하는 데 최적화된 Next.js App Router를 프레임워크로 선택했습니다.</p>
</div>

### 상태 관리

<div>
  <h4>
    <img src="https://img.shields.io/badge/ContextAPI-61DAFB?style=flat-square&logo=React&logoColor=white">
  </h4>
  <p>Context API는 프로젝트에서 users 테이블의 정보를 여러 컴포넌트에서 공유해야 했기 때문에 전역 상태 관리 도구로 사용했습니다. 외부 라이브러리 없이 간단하게 설정할 수 있으며, 특정 컴포넌트 트리 내에서 상태를 공유하고 업데이트하는 데 매우 적합합니다. 이를 통해 코드의 복잡성을 줄이고 데이터 관리의 일관성을 유지할 수 있었습니다.</p>
</div>

<div>
  <h4>
    <img src="https://img.shields.io/badge/ContextAPI-61DAFB?style=flat-square&logo=React&logoColor=white">
  </h4>
  <p>Context API는 프로젝트에서 users 테이블의 정보를 여러 컴포넌트에서 공유해야 했기 때문에 전역 상태 관리 도구로 사용했습니다. 외부 라이브러리 없이 간단하게 설정할 수 있으며, 특정 컴포넌트 트리 내에서 상태를 공유하고 업데이트하는 데 매우 적합합니다. 이를 통해 코드의 복잡성을 줄이고 데이터 관리의 일관성을 유지할 수 있었습니다.</p>
</div>

<div>
  <h4>
    <img src="https://img.shields.io/badge/Zustand-000000?style=flat-square&logo=Zustand&logoColor=white">
  </h4>
  <p>
    Zustand는 Context API만으로 관리하기 어려운 <strong>빈번한 상태 변경</strong>이나 <strong>복잡한 모듈 간 상태 공유</strong>가 필요한 영역에서 도입했습니다. 
    예를 들어, <strong>좋아요 기능, 토스트 알림, 로그인 모달, 이미지 업로드 상태, 사용자 데이터 hydrate</strong>처럼 사용자 인터랙션이 자주 발생하고 여러 컴포넌트 간 공유되어야 하는 기능들은 Zustand로 관리하여 
    <strong>불필요한 리렌더링을 방지</strong>하고 <strong>보다 명확한 상태 분리</strong>를 구현했습니다. 또한 서버 컴포넌트와 클라이언트 컴포넌트 간 상태 전달 문제를 해결하는 데에도 유용하게 사용되었습니다.
  </p>
</div>

### BaaS

<div>
  <h4>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=Supabase&logoColor=white">
  </h4>
  <p>Supabase는 백엔드 구성에 필요한 시간을 크게 단축시켜줍니다. 또한 실시간 데이터 동기화 기능과 다양한 데이터베이스 기능을 제공하여 생산성과 기능성을 동시에 확보할 수 있습니다. 프론트엔드 개발자가 백엔드 구성에 쉽게 접근할 수 있도록 도와주는 Supabase를 선택했습니다.</p>
</div>

### 스타일링

<div>
  <h4>
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=Tailwind%20CSS&logoColor=white">
  </h4>
  <p>Tailwind CSS는 추가적인 CSS 파일 없이도 유지보수가 용이하며, 직관적인 클래스 네이밍으로 빠른 스타일링을 지원합니다. 조건부 스타일링이 쉽고, Next.js와의 호환성도 뛰어나기 때문에 효율적인 개발을 위해 선택했습니다.</p>
</div>

### 협업 도구

<div>
  <h4>
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white">
  </h4>
  <p>GitHub는 분산된 팀 환경에서 효율적인 버전 관리와 협업을 가능하게 합니다. CI/CD 통합, 오픈소스 생태계, 코드 리뷰 및 이슈 관리 기능을 통해 개발 워크플로우를 최적화하고 있습니다.</p>
</div>
<div>
  <h4>
    <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white">
  </h4>
  <p>Figma는 실시간 협업과 디자인 시스템 관리를 지원하는 강력한 UI/UX 도구입니다. 클라우드 기반으로 언제 어디서나 접근이 가능하며, 디자이너와 개발자 간 원활한 협업을 도와 디자인 프로세스를 최적화합니다.</p>
</div>
<div>
  <h4>
    <img src="https://img.shields.io/badge/Excalidraw-000000?style=flat-square&logo=Excalidraw&logoColor=white">
  </h4>
  <p>Excalidraw는 손으로 그린 듯한 직관적인 다이어그램 작성 도구로, 실시간 협업 기능을 통해 아이디어를 빠르게 시각화하고 공유할 수 있습니다. 오픈소스이기 때문에 자유롭게 사용하고 확장할 수 있습니다.</p>
</div>
<div>
  <h4>
    <img src="https://img.shields.io/badge/jira-%230A0FFF.svg?style=flat-square&for-the-badge&logo=jira&logoColor=white">
  </h4>
  <p>프로젝트의 일정 관리와 우선순위 설정을 체계적으로 관리하기 위해 사용했습니다.
Jira를 통해 각 팀원의 작업 진행 상황을 투명하게 공유하고, 이슈 추적을 통해 프로젝트 목표를 명확히 설정하여 효율적인 일정 관리가 가능했습니다. 특히 QA 과정에서 발견된 버그를 개발팀과 즉시 공유하고, 각 이슈의 해결 상태를 추적함으로써 QA와 개발 간의 긴밀한 협업이 이루어지도록 했습니다.</p>
</div>

### 개발 언어

<div>
  <h4>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white">
  </h4>
  <p>TypeScript는 타입 지정으로 인해 코드의 안정성을 높여주고, 런타임 오류를 줄여줍니다. 자동완성 기능과 타입 기반 검증 덕분에 협업 시 개발 생산성을 크게 향상시킵니다. 코드의 안전성과 유지보수성 측면에서 TypeScript를 선택했습니다.</p>
</div>

### 배포 서비스

<div>
  <h4>
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white">
  </h4>
  <p>Vercel은 빠르고 간편한 배포를 지원하며, 서버리스 환경에서 자동으로 스케일링되어 성능이 우수합니다. Next.js와의 완벽한 통합을 통해 최신 웹 애플리케이션을 손쉽게 개발, 배포, 최적화할 수 있어 개발자 경험을 극대화합니다.</p>
</div>

<details>
  <summary><h3 id="structure">📦프로젝트 구조</h3></summary>

```
 gather_here                                                        //
 ┣ .eslintrc.json                                                  //
 ┣ .gitignore                                                      //
 ┣ .nvmrc                                                          //
 ┣ .prettierrc                                                     //
 ┣ LICENSE                                                         //
 ┣ next.config.mjs                                                 //
 ┣ package-lock.json                                               //
 ┣ package.json                                                    //
 ┣ postcss.config.mjs                                              //
 ┣ public                                                          //
 ┃ ┣ assets                                                       //
 ┃ ┃ ┣ gif                                                       //
 ┃ ┃ ┣ header                                                    //
 ┃ ┃ ┣ mypage                                                    //
 ┃ ┣ Calender                                                     //
 ┃ ┣ Chat                                                         //
 ┃ ┣ Common                                                       //
 ┃ ┃ ┗ Icons                                                     //
 ┃ ┣ Detail                                                       //
 ┃ ┣ Favicon                                                      //
 ┃ ┣ Link                                                         //
 ┃ ┣ logos                                                        //
 ┃ ┣ Main                                                         //
 ┃ ┃ ┣ AD                                                        //
 ┃ ┃ ┣ PrCard                                                    //
 ┃ ┣ MyPage                                                       //
 ┃ ┣ Post                                                         //
 ┃ ┃ ┗ .gitkeep                                                  //
 ┃ ┗ Stacks                                                       //
 ┣ README.md                                                       //
src
 ┣ app
 ┃ ┣ (mainpage)
 ┃ ┃ ┣ all
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ events
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ projects
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ studies
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ layout.tsx
 ┃ ┣ @login
 ┃ ┃ ┣ (.)login
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ default.tsx
 ┃ ┣ api
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┗ callback
 ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┣ events
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┗ gatherHub
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┣ eventsdetail
 ┃ ┃ ┣ [id]
 ┃ ┃ ┃ ┣ modaltest
 ┃ ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┃ ┣ layout.tsx
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ not-found.tsx
 ┃ ┣ gatherHub
 ┃ ┃ ┣ layout.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ maindetail
 ┃ ┃ ┣ [id]
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ not-found.tsx
 ┃ ┣ mypage
 ┃ ┃ ┣ hubprofile
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ myinterests
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ mypeople
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ myposts
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ layout.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ post
 ┃ ┃ ┣ (edit)
 ┃ ┃ ┃ ┗ [id]
 ┃ ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ page.tsx
 ┃ ┣ privacy-policy
 ┃ ┃ ┗ page.tsx
 ┃ ┣ search
 ┃ ┃ ┣ [keyword]
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┗ components
 ┃ ┃ ┃ ┗ SearchResultCard.tsx
 ┃ ┣ signup
 ┃ ┃ ┗ page.tsx
 ┃ ┣ terms-of-service
 ┃ ┃ ┗ page.tsx
 ┃ ┣ globals.css
 ┃ ┣ layout.tsx
 ┃ ┣ not-found.tsx
 ┃ ┗ page.tsx
 ┣ components
 ┃ ┣ Common
 ┃ ┃ ┣ Card
 ┃ ┃ ┃ ┗ PostCard
 ┃ ┃ ┃ ┃ ┣ ItEventCardLong.tsx
 ┃ ┃ ┃ ┃ ┣ ItEventCardShort.tsx
 ┃ ┃ ┃ ┃ ┣ PostCardLong.tsx
 ┃ ┃ ┃ ┃ ┗ PostCardShort.tsx
 ┃ ┃ ┣ Header
 ┃ ┃ ┃ ┗ Header.tsx
 ┃ ┃ ┣ Images
 ┃ ┃ ┃ ┗ ImageUploader.tsx
 ┃ ┃ ┣ Loading
 ┃ ┃ ┃ ┣ InitialLoadingWrapper.tsx
 ┃ ┃ ┃ ┣ PuzzleAnimation.tsx
 ┃ ┃ ┃ ┗ SpinnerLoader.tsx
 ┃ ┃ ┣ Modal
 ┃ ┃ ┃ ┣ CommonModal.tsx
 ┃ ┃ ┃ ┗ modal.tsx
 ┃ ┃ ┣ Skeleton
 ┃ ┃ ┃ ┣ CalenderLoader.tsx
 ┃ ┃ ┃ ┣ CardSkeleton.tsx
 ┃ ┃ ┃ ┣ CarouselLoader.tsx
 ┃ ┃ ┃ ┣ LeftNavLoader.tsx
 ┃ ┃ ┃ ┣ MypageList.tsx
 ┃ ┃ ┃ ┣ MypageProfileInfo.tsx
 ┃ ┃ ┃ ┣ MypageProfilePicture.tsx
 ┃ ┃ ┃ ┗ ProfileLoader.tsx
 ┃ ┃ ┗ Toast
 ┃ ┃ ┃ ┗ Toast.tsx
 ┃ ┣ EventsDetail
 ┃ ┃ ┗ ITLikeButton.tsx
 ┃ ┣ GatherHub
 ┃ ┃ ┣ CardModalClient.tsx
 ┃ ┃ ┣ CardModalServer.tsx
 ┃ ┃ ┣ CardModalShell.tsx
 ┃ ┃ ┣ CardUIClient.tsx
 ┃ ┃ ┣ CardUIServer.tsx
 ┃ ┃ ┣ GatherHubPage.tsx
 ┃ ┃ ┣ JobDirectoryClient.tsx
 ┃ ┃ ┣ JobDirectoryServer.tsx
 ┃ ┃ ┣ JobFilter.tsx
 ┃ ┃ ┣ MemberCardServer.tsx
 ┃ ┃ ┣ MemberListServer.tsx
 ┃ ┃ ┗ Pagination.tsx
 ┃ ┣ Layout
 ┃ ┃ ┗ MainLayout.tsx
 ┃ ┣ Login
 ┃ ┃ ┣ LoginForm.tsx
 ┃ ┃ ┗ OAuthButtons.tsx
 ┃ ┣ MainDetail
 ┃ ┃ ┣ actions
 ┃ ┃ ┃ ┗ deletePost.ts
 ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ common
 ┃ ┃ ┃ ┃ ┣ LikeButton.tsx
 ┃ ┃ ┃ ┃ ┗ ShareButton.tsx
 ┃ ┃ ┃ ┣ form
 ┃ ┃ ┃ ┃ ┣ style
 ┃ ┃ ┃ ┃ ┃ ┗ customSelectStyle.ts
 ┃ ┃ ┃ ┃ ┣ FormDropdown.tsx
 ┃ ┃ ┃ ┃ ┣ FormInput.tsx
 ┃ ┃ ┃ ┃ ┗ FormMultiSelect.tsx
 ┃ ┃ ┃ ┗ PostTechStackIcons.tsx
 ┃ ┃ ┣ MainDetailClient.tsx
 ┃ ┃ ┣ MainDetailLayout.tsx
 ┃ ┃ ┣ MainDetailServer.tsx
 ┃ ┃ ┣ ReactQuillEditor.tsx
 ┃ ┃ ┗ custom-quill.css
 ┃ ┣ MainPage
 ┃ ┃ ┣ AdCard
 ┃ ┃ ┃ ┗ AdCard.tsx
 ┃ ┃ ┣ Carousel
 ┃ ┃ ┃ ┣ Carousel.css
 ┃ ┃ ┃ ┣ Carousel.tsx
 ┃ ┃ ┃ ┗ EventsCarousel.tsx
 ┃ ┃ ┣ FilterBar
 ┃ ┃ ┃ ┣ EventFilterBar.tsx
 ┃ ┃ ┃ ┗ FilterBar.tsx
 ┃ ┃ ┣ InfiniteScroll
 ┃ ┃ ┃ ┗ EventsInfiniteScroll.tsx
 ┃ ┃ ┣ MainSideBar
 ┃ ┃ ┃ ┣ Calender
 ┃ ┃ ┃ ┃ ┣ Calender.tsx
 ┃ ┃ ┃ ┃ ┗ fullcalender.css
 ┃ ┃ ┃ ┣ Chat
 ┃ ┃ ┃ ┃ ┣ Chat.tsx
 ┃ ┃ ┃ ┃ ┗ ChatModal.tsx
 ┃ ┃ ┃ ┣ Footer
 ┃ ┃ ┃ ┃ ┣ Footer.css
 ┃ ┃ ┃ ┃ ┗ Footer.tsx
 ┃ ┃ ┃ ┣ PrCard
 ┃ ┃ ┃ ┃ ┗ PrCard.tsx
 ┃ ┃ ┃ ┗ MainSideBar.tsx
 ┃ ┃ ┣ NavTab
 ┃ ┃ ┃ ┗ NavTabs.tsx
 ┃ ┃ ┗ PageContent
 ┃ ┃ ┃ ┣ All
 ┃ ┃ ┃ ┃ ┣ AllClientContent.tsx
 ┃ ┃ ┃ ┃ ┗ AllServerContent.tsx
 ┃ ┃ ┃ ┣ Project
 ┃ ┃ ┃ ┃ ┣ ProjectClientContent.tsx
 ┃ ┃ ┃ ┃ ┗ ProjectServerContent.tsx
 ┃ ┃ ┃ ┣ Section
 ┃ ┃ ┃ ┃ ┣ RecruitmentPostListSection.tsx
 ┃ ┃ ┃ ┃ ┗ RecruitmentTopSection.tsx
 ┃ ┃ ┃ ┣ Study
 ┃ ┃ ┃ ┃ ┣ StudiesClientContent.tsx
 ┃ ┃ ┃ ┃ ┗ StudiesServerContent.tsx
 ┃ ┃ ┃ ┣ BaseClientContent.tsx
 ┃ ┃ ┃ ┗ EventsContent.tsx
 ┃ ┣ MyPage
 ┃ ┃ ┣ Common
 ┃ ┃ ┃ ┣ LeftNav.tsx
 ┃ ┃ ┃ ┗ Pagination.tsx
 ┃ ┃ ┣ HubInfo
 ┃ ┃ ┃ ┣ components
 ┃ ┃ ┃ ┃ ┣ BackgroundPicture.tsx
 ┃ ┃ ┃ ┃ ┣ HubProfileInfo.tsx
 ┃ ┃ ┃ ┃ ┣ Introductioin.tsx
 ┃ ┃ ┃ ┃ ┣ TeamQuestions.tsx
 ┃ ┃ ┃ ┃ ┗ TechStack.tsx
 ┃ ┃ ┃ ┣ reducer
 ┃ ┃ ┃ ┃ ┗ hubProfileReducer.ts
 ┃ ┃ ┃ ┣ HubProfile.tsx
 ┃ ┃ ┃ ┣ HubProfileClientForm.tsx
 ┃ ┃ ┃ ┗ HubProfileToggle.tsx
 ┃ ┃ ┣ MyInfo
 ┃ ┃ ┃ ┣ actions
 ┃ ┃ ┃ ┃ ┣ doubleCheckNickname.ts
 ┃ ┃ ┃ ┃ ┣ updateProfile.ts
 ┃ ┃ ┃ ┃ ┗ updateUserImage.ts
 ┃ ┃ ┃ ┣ reducer
 ┃ ┃ ┃ ┃ ┗ useProfileReducer.ts
 ┃ ┃ ┃ ┣ ProfileImage.tsx
 ┃ ┃ ┃ ┣ UserProfileClientForm.tsx
 ┃ ┃ ┃ ┗ UserProfileForm.tsx
 ┃ ┃ ┣ MyInterests
 ┃ ┃ ┃ ┗ InterestsTap.tsx
 ┃ ┃ ┣ MyPeople
 ┃ ┃ ┃ ┣ LikePeople.tsx
 ┃ ┃ ┃ ┗ LikePeopleClient.tsx
 ┃ ┃ ┗ MyPosts
 ┃ ┃ ┃ ┗ PostsTap.tsx
 ┃ ┣ PostEdit
 ┃ ┃ ┣ PostEditClient.tsx
 ┃ ┃ ┗ PostEditServer.tsx
 ┃ ┣ PostForm
 ┃ ┃ ┣ reducer
 ┃ ┃ ┃ ┗ postFormReducer.ts
 ┃ ┃ ┣ PostFormButtons.tsx
 ┃ ┃ ┣ PostFormEditor.tsx
 ┃ ┃ ┣ PostFormInputs.tsx
 ┃ ┃ ┣ PostFormModals.tsx
 ┃ ┃ ┣ PostFormRecruit.tsx
 ┃ ┃ ┣ PostFormWrapper.tsx
 ┃ ┃ ┗ postFormTypes.ts
 ┃ ┣ Search
 ┃ ┃ ┣ SearchBar.tsx
 ┃ ┃ ┗ SearchModal.tsx
 ┃ ┗ Signup
 ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ AlertModal.tsx
 ┃ ┃ ┃ ┣ ExperienceLevelButton.tsx
 ┃ ┃ ┃ ┣ JobSelectionButton.tsx
 ┃ ┃ ┃ ┣ NicknameInput.tsx
 ┃ ┃ ┃ ┗ SkipButton.tsx
 ┃ ┃ ┣ Signup01.tsx
 ┃ ┃ ┣ Signup02.tsx
 ┃ ┃ ┣ Signup03.tsx
 ┃ ┃ ┣ Signup04.tsx
 ┃ ┃ ┗ SigupForm.tsx
 ┣ fonts
 ┃ ┗ PretendardVariable.woff2
 ┣ hooks
 ┃ ┣ useChat.ts
 ┃ ┣ useCheckNickname.ts
 ┃ ┣ useDebounce.ts
 ┃ ┣ useDraftStorage.ts
 ┃ ┣ useFetchUserData.ts
 ┃ ┣ useImageUploadManager.ts
 ┃ ┣ useMediaQuery.ts
 ┃ ┣ useMemberData.ts
 ┃ ┣ usePostForm.ts
 ┃ ┣ useScrollRestoration.ts
 ┃ ┣ useSearch.ts
 ┃ ┣ useSelectJob.ts
 ┃ ┣ useSessionManager.ts
 ┃ ┣ useSubmitProfile.ts
 ┃ ┗ useUpdateUserData.ts
 ┣ lib
 ┃ ┣ fetchPosts.ts
 ┃ ┣ gatherHub.ts
 ┃ ┣ generalOptionStacks.ts
 ┃ ┣ postFormOptions.ts
 ┃ ┗ validation.ts
 ┣ provider
 ┃ ┣ user
 ┃ ┃ ┣ UserAuthProvider.tsx
 ┃ ┃ ┗ UserSignupProvider.tsx
 ┃ ┣ CombinedProviders.tsx
 ┃ ┣ ContextProvider.tsx
 ┃ ┗ QueryClientProvider.tsx
 ┣ stores
 ┃ ┣ useLikeCountStore.ts
 ┃ ┣ useLikeStore.ts
 ┃ ┣ useLoginModalStore.ts
 ┃ ┣ usePostLikeCountStore.ts
 ┃ ┣ usePostLikeStore.ts
 ┃ ┣ useToastStore.ts
 ┃ ┗ useUserStore.ts
 ┣ types
 ┃ ┣ chats
 ┃ ┃ ┗ Chats.type.ts
 ┃ ┣ posts
 ┃ ┃ ┗ Post.type.ts
 ┃ ┣ refs
 ┃ ┃ ┗ SearchModal.ts
 ┃ ┣ supabase.ts
 ┃ ┗ userData.ts
 ┣ utils
 ┃ ┣ Image
 ┃ ┃ ┣ convertToWebp.ts
 ┃ ┃ ┗ imageUtils.ts
 ┃ ┣ Search
 ┃ ┃ ┗ highlight.ts
 ┃ ┣ like
 ┃ ┃ ┗ getLikeCount.ts
 ┃ ┣ postUtils
 ┃ ┃ ┗ postFormUtils.ts
 ┃ ┣ scroll
 ┃ ┃ ┗ InfinityScroll.ts
 ┃ ┣ supabase
 ┃ ┃ ┣ auth.ts
 ┃ ┃ ┣ client.ts
 ┃ ┃ ┣ errors.ts
 ┃ ┃ ┣ middleware.ts
 ┃ ┃ ┣ server.ts
 ┃ ┃ ┣ types.ts
 ┃ ┃ ┗ user.ts
 ┃ ┣ fetchMembers.ts
 ┃ ┗ mainDetailUtils.ts
 ┗ middleware.ts
 ┣ supabase                                                        //
 ┃  ┣ .gitignore                                                   //
 ┃  ┣ config.toml                                                  //
 ┃  ┗  seed.sql                                                     //
 ┣  tailwind.config.ts                                              //
 ┗ tsconfig.json                                                   //

```

</details>

## <h3 id="ui"> 6. 🎨 UI </h3>

#### 시작하기, 메인페이지 게시물 리스트

<img src="https://github.com/user-attachments/assets/5e8e84d3-78c0-48ff-8454-81a74ddd4676" alt="프로젝트 결과 1" width="800px" />

#### IT 행사, 메인페이지 채팅, PR 섹션

<img src="https://github.com/user-attachments/assets/620a8201-9925-4c98-a5b6-932515e7f033" alt="프로젝트 결과 2" width="800px" />
<img src="https://github.com/user-attachments/assets/741e7b75-032a-4a63-9787-3bb823fd1c41" alt="프로젝트 결과 3" width="800px" />

#### 마이페이지

<img src="https://github.com/user-attachments/assets/f45c4fb7-1333-4d0c-be3d-1d3d2c2c0131" alt="프로젝트 결과 4" width="800px" />
