<div align="center">

<img src="https://user-images.githubusercontent.com/45951630/151654792-3e064ca8-f2e6-4a13-945a-626705152957.png" width="400px" alt="42Cabi" />

[![GitHub Stars](https://img.shields.io/github/stars/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/stargazers) [![GitHub Stars](https://img.shields.io/github/issues/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/issues) [![Current Version](https://img.shields.io/badge/version-3.0.0-black?style=for-the-badge)](https://github.com/IgorAntun/node-chat) [![GitHub License](https://img.shields.io/github/license/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/IgorAntun/node-chat/issues)

</div>

## 목차

- [💬 프로젝트 소개](#-프로젝트-소개)
- [🛠 기술 스택](#-기술-스택)
- [🧑‍💻 프로젝트 멤버](#-프로젝트-멤버)
- [🗂 위키](#-위키)

<br/>

## 💬 프로젝트 소개

### 웹사이트

- https://cabi.42seoul.io/

### 프로젝트 목표
- 사물함 대여 서비스: 42서울 클러스터의 캐비닛 약 300여개를 편리하게 대여 및 반납할 수 있는 서비스
- 1,000명 이상의 카뎃들이 사용하는 플랫폼: 모든 카뎃들이 캐비닛 사용 현황을 언제든 간편하게 확인할 수 있는 플랫폼
- 관리자 플랫폼: 캐비닛 대여 현황 및 상태를 도식화하여 한눈에 확인 및 변경 가능한 플랫폼

### 프로젝트 내용
- 클러스터 별 사물함 배치도를 바탕으로 실제 위치에 따른 사물함 대여 현황을 확인할 수 있습니다.
- 클러스터에 방문할 필요 없이 간편하게 사물함 대여 및 반납이 가능합니다.
    - 사물함 별로 `READ` / `UPDATE` 가능한 개인 메모장을 제공합니다.
- 공유사물함 기능을 도입해 최대 3명의 사용자가 한 개의 사물함을 공유할 수 있습니다.

### 기술적 도전

- **1,000명 이상의 카뎃들**에게 더 양질의 서비스를 제공하기 위해 **42Cabi 팀**은 아래와 같이 고민했습니다:

#### [Back-end](https://github.com/innovationacademy-kr/42cabi/tree/dev/backend)

- 사용자가 층별로 캐비넷 정보를 조회할 때 빠른 응답속도를 위해 쿼리 최적화로 성능을 향상시켰습니다.
- 공유 사물함 서비스를 구현하며 캐비넷 대여/반납에서 발생할 수 있는 케이스가 많아 캐비넷 상태에 따라 처리되는 DFA 알고리즘을 적용했습니다.
- 동시에 들어오는 요청에 대해 특정 요청이 실패할 경우 무결성을 위해 대여/반납의 과정을 트랜잭션으로 관리하였으며 격리 수준 구별로 데드락을 방지하였습니다.
- 블랙홀에 빠진 유저(퇴학 처리된 유저)를 적절하게 처리하도록 42 API를 사용하였고 블랙홀 스케줄링 구조를 고안했습니다.
- 기존 버전에서 Express.js로 작성된 코드를 백앤드 기술에서 많이 사용하는 IoC, DI, AOP가 적용되어 유지보수에 유리한 Nest.js로 포팅했습니다.
- 불필요한 정보를 저장하는 컬럼을 제거하는 등 DB 구조를 개선하였습니다.

#### [Front-end](https://github.com/innovationacademy-kr/42cabi/tree/dev/frontend_v3)

- 다양한 환경에서도 이용에 불편함이 없도록 반응형 웹 디자인을 적용했습니다.
- 사용자들이 쉽게 사물함을 찾을 수 있도록 평면도에 구역을 표시한 페이지를 포함한 캐러셀을 구현했습니다.
- 사용자들이 서비스를 이용하면서 현재 상태를 쉽게 알 수 있도록 로딩이나 에러 발생 등 상황에 맞는 정보를 줄 수 있도록 처리했습니다.
- 쉽게 변할 수 있는 정책이나 UI/UX를 빠르게 반영할 수 있도록 하드코딩을 최대한 피하고 props와 환경변수를 이용했습니다.
- 신규 팀원이 들어와도 지속적으로 유지/보수와 기능 추가가 용이하도록 코딩 컨벤션을 정하고 문서화 작업 및 이슈 관리를 진행했습니다.

<br/>

## 🛠 기술 스택

<div>
  
<table border="1">
  <th align="center">분야</th>
  <th align="center">기술스택</th>
  <th align="center">선정이유</th>
  <tr>
    <td rowspan="3" align="center">Common</td>
    <td>TypeScript</td>
    <td>컴파일 타임에 에러를 검출하여 서비스 과정에서 발생할 수 있는 오류를 최소화</td>
  </tr>
  <tr>
    <td>ESLint</td>
    <td>코딩 컨벤션에 위배되거나 안티 패턴을 미리 검출하여 에러 발생 요소를 </td>
  </tr>
  <tr>
    <td>Prettier</td>
    <td>기본적인 코딩룰 적용으로 가독성 향상</td>
  </tr>
  <tr>
    <td rowspan="6" align="center">Front-End</td>
    <td>React</td>
    <td>컴포넌트 기반의 UI 구현으로 재사용성을 높이고 상태 관리를 통한 성능 최적화</td>
  </tr>
  <tr>
    <td>Redux</td>
    <td>API 요청 최소화 및 컴포넌트간 공유하는 상태를 효율적으로 관리하여 리렌더링 최적화</td>
  </tr>
  <tr>
    <td>styled-components</td>
    <td>CSS in JS를 통해 컴포넌트와 스타일 간의 의존성을 제거하여 컴포넌트 단위의 재사용성 향상</td>
  </tr>
  <tr>
    <td>Vite</td>
    <td>esbuild를 통한 빠른 번들링과 HMR을 통한 생산성 향상</td>
  </tr>
  <tr>
    <td>material-UI</td>
    <td>안드로이드 시스템에서 검증된 신뢰성과 리액트와의 호환성을 바탕으로 생산성 향상</td>
  </tr>
  <tr>
    <td>Storybook</td>
    <td>공통 UI 컴포넌트 제작 시 컴포넌트를 독립적으로 만들고, 테스트하는 과정을 통한 생산성 향상</td>
  </tr>
  <tr>
    <td rowspan="5" align="center">Back-End</td>
    <td>NestJS</td>
    <td>백엔드에 필요한 기술들인 Ioc, DI, AOP 등이 적용되어 있고, Express.js 프레임워크 대비 낮은 자유도로 협업에 적합</td>
  </tr>
  <tr>
    <td>MariaDB</td>
    <td>많이 사용되는 만큼 래퍼런스를 찾기 쉽고, 개발 과정에서 생기는 문제에 대한 해결책을 찾기 용이</td>
  </tr>
  <tr>
    <td>TypeORM</td>
    <td>SQL raw query로 작성하는 것보다 유지 보수 측면에서 유리하고, 추후 다른 DBMS로 쉽게 전환 가능</td>
  </tr>
  <tr>
    <td>Swagger</td>
    <td>프론트엔드 팀원들과 HTTP API 소통을 하기 위해 사용</td>
  </tr>
  <tr>
    <td>Passport</td>
    <td>OAuth2 적용을 위해 사용</td>
  </tr>
  <tr>
    <td rowspan="5" align="center">Infra</td>
    <td>nginx</td>
    <td>로컬 개발 모드에서 리버스 프록시를 이용하여 개발의 편의성을 높이기 위해 사용</td>
  </tr>
  <tr>
    <td>AWS</td>
    <td>ec2 인스턴스에 프로젝트를 배포하고 RDS를 이용하여 DB관리, S3 스토리지에 정적 파일을 저장하여 관리하기 위해 사용</td>
  </tr>
  <tr>
    <td>PM2</td>
    <td>프로젝트 배포 시 node 데몬을 관리할 때 사용</td>
  </tr>
  <tr>
    <td>Docker-compose</td>
    <td>로컬 개발 시 동일한 환경에서 쉽게 세팅하기 위해 사용하였으며, MariaDB와 Nginx를 구동할 때 사용</td>
  </tr>
  <tr>
    <td>Github Actions</td>
    <td>CI/CD를 구현해서 검증 및 반복 작업의 자동화로 개발의 편의성 </td>
  </tr>
</table>

</div>
<br/>

## 🧑‍💻 프로젝트 멤버

<div align="center">

| [🍑 eunbikim](https://github.com/eunbi9n) | [🥔 gyuwlee](https://github.com/gyutato) | [👻 hybae](https://github.com/HyeonsikBae) | [🍒 hyoon](https://github.com/kamg2218) | [🍏 hyospark](https://github.com/kyoshong) |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------ | --------------------------------------- | ------------------------------------------ |

| [🧑‍✈️ jaesjeon](https://github.com/Oris482) | [🐶 jiwchoi](https://github.com/jiwon-choi) | [🐯 joopark](https://github.com/joohongpark) | [🐻 seuan](https://github.com/aseungbo) | [😺 sichoi](https://github.com/sichoi42) |
| ----------------------------------------- | ------------------------------------------- | -------------------------------------------- | --------------------------------------- | ---------------------------------------- |

| [🍎 skim](https://github.com/subin195-09) | [🍪 spark](https://github.com/Hyunja27) | [🪀 yoyoo](https://github.com/Yoowatney) | [🎒 yubchoi](https://github.com/yubinquitous) | <a href="https://github.com/innovationacademy-kr"><img src="https://img.shields.io/badge/42Seoul-000000?style=flat-square&logo=42&logoColor=white" /></a> |
| ----------------------------------------- | --------------------------------------- | ---------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |

</div>
<br/>

<!-- ## 📚 위키

<div align="center">

| 🤝 규칙                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 📝 명세서                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 🗂 백로그                                                                                                                                            | 🏃‍♂️ 스프린트                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 🙋‍♂️ 회의록                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 👯‍♀️ 스크럼                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/팀-목표">팀 목표</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/그라운드-룰">그라운드 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/git-전략">git 전략</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/네이밍-룰">네이밍 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/React-코드-포맷">React 코드 포맷</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ESLint&Prettier">ESLint&Prettier</a></li></ul> | <ul><li><a href="https://www.figma.com/file/Jnu0QBCLdbRJ94G5jhzl8F/%EB%8F%99%EB%84%A4%ED%9B%84%EA%B8%B0?node-id=0%3A1">디자인 명세서</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ERD">ERD</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/인프라 구조">인프라 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/프로젝트 폴더 구조">프로젝트 폴더 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/API 명세서">API 명세서</a></li></ul> | <ul><li><a href="https://docs.google.com/spreadsheets/d/1dt-VD4Iwxucy0ygJFUK-5dqbiBJOHNPNBY00G2yfRPo/edit#gid=0">백로그 스프레드 시트</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스프린트">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스프린트">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스프린트">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 스프린트">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스프린트">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 회의록">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 회의록">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 회의록">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 회의록">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 회의록">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 회의록">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 스크럼">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스크럼">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스크럼">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스크럼">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스크럼">6주차</a></li></ul> |

</div> -->
