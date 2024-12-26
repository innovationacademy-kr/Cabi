<div align="center">
<a href="https://cabi.oopy.io/">
  <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/13278955/278554161-83bfed83-e148-44e5-8389-b49598725ce4.png" width="400px" alt="Cabi" />
</a>

[![GitHub Stars](https://img.shields.io/github/stars/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/stargazers) [![GitHub Stars](https://img.shields.io/github/issues/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/issues) [![Current Version](https://img.shields.io/badge/version-4.0.0-black?style=for-the-badge)](https://github.com/IgorAntun/node-chat) [![GitHub License](https://img.shields.io/github/license/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/IgorAntun/node-chat/issues)

</div>

## 목차

- [💬 프로젝트 소개](#-프로젝트-소개)
- [🛠 기술 스택](#-기술-스택)
- [🧑‍💻 프로젝트 멤버](#-프로젝트-멤버)

<!-- - [🗂 위키](#-위키) -->

<br/>

## 💬 프로젝트 소개

### 웹사이트

- https://cabi.42seoul.io/

### 프로젝트 목표

- 캐비닛 대여 서비스: 42서울의 캐비닛 400여 개를 편리하게 대여 및 반납할 수 있는 서비스
- 효율적이고 원활한 서비스: 제한된 자원으로 많은 사용자가 원활하게 사용할 수 있는 서비스
- 관리자 플랫폼: 캐비닛 대여 현황 및 상태를 도식화하여 관리자의 작업이 수월한 플랫폼

### 프로젝트 내용

- 클러스터 별 캐비닛 배치도를 바탕으로 실제 위치에 따른 캐비닛 대여 현황을 확인할 수 있습니다.
- 클러스터에 방문할 필요 없이 간편하게 캐비닛 대여 및 반납이 가능합니다.
- 캐비닛마다 `READ` / `UPDATE` 가능한 메모장을 제공합니다.
  - 공유 캐비닛의 경우, 캐비닛 사용자들끼리만 공유 가능한 메모장을 제공합니다.

### 서비스 이용안내

- https://cabi.oopy.io/d208e0c9-1022-4c88-be6d-94f191899111

### 수상 내역 🏆

- 이노베이션아카데미 성과 공유 컨퍼런스 2024 **과학기술정보통신부 장관상(🥇대상)** 수상 (2024)
- 이노베이션아카데미 성과 공유 컨퍼런스 2023 **정보통신기획평가원 원장상(🥈최우수상)** 수상 (2023)
- 이노베이션아카데미 성과 공유 컨퍼런스 2022 **이노베이션 아카데미 학장상(🥉우수상)** 수상 (2022)

### 기술적 도전

- 지속할 수 있고, 확장할 수 있는 서비스를 지향하고, 한정된 자원으로 **증가하는 사용자**들에게 양질의 서비스를 제공하기 위해 **Cabi 팀**은 다음과 같이 노력했습니다:

#### [Common](https://github.com/innovationacademy-kr/42cabi/)

- 코드 리뷰를 통해 팀원들의 코드 품질을 향상시키고, 팀원들 간의 지식 공유를 통해 개발자들의 역량을 향상시켰습니다.
- 유지/보수와 기능 추가가 용이하도록 코딩 컨벤션을 정하고, 문서화 작업 및 이슈 관리를 체계화했습니다.
- Notion, Slack 등의 협업 툴들을 이용하여 팀원 간 정보 시차와 격차를 줄였습니다.
- 주기적이지만 유동적인 회의를 통해 목표와 분업을 명확히 하여 효과적인 협업을 진행했습니다.
- 시설관리팀과 실사용자들과 끊임없이 소통하면서 사용자 친화적인 서비스를 제공했습니다.

#### [FrontEnd](https://github.com/innovationacademy-kr/42cabi/tree/dev/frontend_v3)

- 웹, 모바일 환경에서도 이용에 불편함이 없도록 반응형 웹 디자인을 적용했습니다.
- 사용자가 쉽게 캐비닛을 찾을 수 있도록 실제 사용 공간에 따른 맵을 표시했습니다.
- 원활한 사용자 경험을 위해 페이지를 포함한 캐러셀을 구현했습니다.
- 사용자가 서비스 상태를 명확하게 인지할 수 있도록 로딩과 에러 코드에 따른 렌더링을 구현했습니다.
- 정책이나 UI/UX 등 빠르게 변화하는 환경을 원활히 반영할 수 있도록 하드코딩을 피하고 props와 환경변수를 이용해 유지보수성을 높였습니다.

#### [BackEnd](https://github.com/innovationacademy-kr/42cabi/tree/dev/backend)

- 사용자가 층별로 캐비닛 정보를 조회할 때 빠른 응답속도를 위해 쿼리 최적화로 성능을 향상했습니다.
- 공유 캐비닛에서 발생하는 동시성 문제를 해결하기 위해 적절한 락 전략을 구성하고, 데드락을 방지하는 로직을 구현했습니다.
- 블랙홀에 빠진 사용자(퇴학 처리된 사용자)를 적절하게 처리하기 위해 스케줄러를 구성하여 자동으로 해당 사용자의 접근 및 권한을 정리하고 시스템에서 안전하게 제거하도록 했습니다.
- 연체/대여/반납 등 중요한 이벤트에 대해 사용자에게 알림을 제공함으로써 사용자가 서비스를 더욱 편리하게 이용할 수 있도록 했습니다.
- 로깅, 인증과 같은 횡단 관심사에 대해 AOP를 적용하여 중복되는 코드를 줄이고, 유지보수성을 높였습니다.
- CI 워크플로우를 구축하여 빌드, 테스트를 자동화하여 개발자들의 생산성을 높였습니다.
- CD 워크플로우를 구축하여 배포과정을 자동화하여 안정적인 서비스를 제공했습니다.
- 효율적인 인프라 구조를 설계하여 보다 효율적이고 확장가능성을 가지며, 안정적인 서비스를 제공했습니다.
- Prometheus/Grafana + 핀포인트를 활용한 모니터링 시스템을 구축하여, 문제 발생시, 빠르게 대응하여 문제의 원인을 파악하고 해결할 수 있도록 기반을 마련했습니다.

<br/>

## 🕸️ 인프라 구조도

![Untitled](https://github.com/innovationacademy-kr/Cabi/assets/83565255/165c1529-6164-4988-9495-6bc2ba3ef0ab)

## 🛠 기술 스택

<div>

<table border="1">
  <th align="center">분야</th>
  <th align="center">기술스택</th>
  <th align="center">선정이유</th>
  <tr>
    <td rowspan="3" align="center">Common</td>
    <td><img src="https://cdn-icons-png.flaticon.com/512/5968/5968381.png" width="15px" alt="typescript_icon" /> TypeScript</td>
    <td>컴파일 타임에 에러를 검출하여 서비스 과정에서 발생할 수 있는 오류를 최소화했습니다.</td>
  </tr>
  <tr>
  <tr>
    <td><img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3256745/file-type-light-prettier-icon-md.png" width="15px" alt="_icon" /> Prettier</td>
    <td>기본적인 코딩룰 적용으로 가독성 향상 및 코드 양식을 통일했습니다.</td>
  </tr>
  <tr>
    <td rowspan="4" align="center">Front-End</td>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="15px" alt="_icon" /> React</td>
    <td>컴포넌트 기반의 UI 구현으로 재사용성을 높이고 상태 관리를 통해 성능을 최적화했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1641952185/noticon/a9qgcuhj0enmzobh68cf.png" width="15px" alt="_icon" /> Recoil</td>
    <td>API 요청 최소화 및 컴포넌트간 공유하는 상태를 효율적으로 관리하여 리렌더링을 최적화했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/20658825?s=200&v=4" width="15px" alt="_icon" /> styled-components</td>
    <td>CSS in JS를 통해 컴포넌트와 스타일 간의 의존성을 제거하여 컴포넌트 단위의 재사용성을 향상했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://vitejs.dev/logo-with-shadow.png" width="15px" alt="_icon" /> Vite</td>
    <td>esbuild를 통한 빠른 번들링과 HMR을 통해 생산성을 향상했습니다.</td>
  </tr>
  <tr>
    <td rowspan="5" align="center">Back-End</td>
    <td><img src="https://cdn.simpleicons.org/spring/#6DB33F.svg" width="15px" alt="_icon" /> Spring Framework</td>
    <td>Spring Framework 기반의 프로젝트로, 다양한 레퍼런스와 라이브러리를 활용하여 안정적인 서비스를 구축했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://static-00.iconduck.com/assets.00/mariadb-icon-512x340-txozryr2.png" width="18px" alt="_icon" /> MariaDB</td>
    <td>활성화된 커뮤니티를 통해 여러 레퍼런스를 이용, 개발 중 발생하는 여러 문제들을 해결했습니다.</td>
  </tr>
  <tr>
  <tr>
  </tr>
  <tr>
  </tr>
  <tr>
    <td rowspan="5" align="center">Infra</td>
    <td><img src="https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_nginx_icon_130305.png" width="15px" alt="_icon" /> nginx</td>
      <td>로컬 개발환경에서 리버스 프록시를 통한 프론트/백엔드 서버 라우팅으로 개발의 편의성을 높였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/AWS_Simple_Icons_AWS_Cloud.svg/2560px-AWS_Simple_Icons_AWS_Cloud.svg.png" width="15px" alt="_icon" /> AWS</td>
    <td>비용효율적이고 신뢰도가 높은 웹서비스로 판단, EC2/RDS/S3/CloudFront 등의 솔루션들을 사용하여 신속하고 안정적인 서비스 환경을 구성했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" width="15px" alt="_icon" /> Docker</td>
      <td>컨테이너를 통해 프러덕션과 로컬 환경의 동일성을 유지하고, 배포과정을 자동화하여 개발환경의 일관성을 유지했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/44036562?s=280&v=4" width="15px" alt="_icon" /> Github Actions</td>
    <td>CI/CD를 통해 테스트, 배포를 자동화하여 무중단 서비스를 지원, 효율성과 효과성을 높였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://cdn.simpleicons.org/prometheus/#E6522C.svg" width="15px" alt="_icon" /> <img src="https://cdn.simpleicons.org/grafana/##F46800.svg" width="15px" alt="_icon" />Prometheus/Grafana</td>
    <td>애플리케이션 서버의 상태를 모니터링하여 이상 징후를 빠르게 파악하고 대응하여 서비스의 안정성을 높였습니다.</td>
  </tr>
</table>

</div>
<br/>

## 🧑‍💻 프로젝트 멤버

<div align="center">

[🦝 jimchoi](https://github.com/jimchoi9) |
| <a href="https://github.com/innovationacademy-kr"><img src="https://img.shields.io/badge/42Seoul-000000?style=flat-square&logo=42&logoColor=white" /></a> |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- |

</div>
<br/>

<!-- ## 📚 위키(미완성)

<div align="center">

| 🤝 규칙                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 📝 명세서                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 🗂 백로그                                                                                                                                            | 🏃‍♂️ 스프린트                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 🙋‍♂️ 회의록                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 👯‍♀️ 스크럼                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/팀-목표">팀 목표</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/그라운드-룰">그라운드 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/git-전략">git 전략</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/네이밍-룰">네이밍 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/React-코드-포맷">React 코드 포맷</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ESLint&Prettier">ESLint&Prettier</a></li></ul> | <ul><li><a href="https://www.figma.com/file/Jnu0QBCLdbRJ94G5jhzl8F/%EB%8F%99%EB%84%A4%ED%9B%84%EA%B8%B0?node-id=0%3A1">디자인 명세서</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ERD">ERD</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/인프라 구조">인프라 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/프로젝트 폴더 구조">프로젝트 폴더 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/API 명세서">API 명세서</a></li></ul> | <ul><li><a href="https://docs.google.com/spreadsheets/d/1dt-VD4Iwxucy0ygJFUK-5dqbiBJOHNPNBY00G2yfRPo/edit#gid=0">백로그 스프레드 시트</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스프린트">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스프린트">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스프린트">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 스프린트">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스프린트">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 회의록">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 회의록">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 회의록">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 회의록">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 회의록">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 회의록">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 스크럼">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스크럼">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스크럼">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스크럼">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스크럼">6주차</a></li></ul> |

</div> -->
