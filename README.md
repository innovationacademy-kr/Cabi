<div align="center">

<img src="https://user-images.githubusercontent.com/45951630/151654792-3e064ca8-f2e6-4a13-945a-626705152957.png" width="400px" alt="42Cabi" />

[![GitHub Stars](https://img.shields.io/github/stars/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/stargazers) [![GitHub Stars](https://img.shields.io/github/issues/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/innovationacademy-kr/42cabi/issues) [![Current Version](https://img.shields.io/badge/version-3.0.0-black?style=for-the-badge)](https://github.com/IgorAntun/node-chat) [![GitHub License](https://img.shields.io/github/license/innovationacademy-kr/42cabi?style=for-the-badge)](https://github.com/IgorAntun/node-chat/issues)

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
- 사물함 대여 서비스: 42서울의 캐비닛 400여개를 편리하게 대여 및 반납할 수 있는 서비스
- 효율적이고 원활한 서비스: 제한된 자원으로 많은 사용자가 원활하게 사용할 수 있는 서비스
- 관리자 플랫폼: 캐비닛 대여 현황 및 상태를 도식화하여 관리자의 작업이 수월한 플랫폼

### 프로젝트 내용
- 클러스터 별 사물함 배치도를 바탕으로 실제 위치에 따른 사물함 대여 현황을 확인할 수 있습니다.
- 클러스터에 방문할 필요 없이 간편하게 사물함 대여 및 반납이 가능합니다.
    - 사물함마다 `READ` / `UPDATE` 가능한 메모장을 제공합니다.
- 공유 사물함 기능을 도입해 최대 3명의 사용자가 한 개의 사물함을 공유할 수 있습니다.

### 기술적 도전

- 지속 가능하고 확장 가능한 서비스를 지향하고, 한정된 자원으로 **지속적으로 증가하는 사용자**들에게 양질의 서비스를 제공하기 위해 **42Cabi 팀**은 다음과 같이 노력했습니다:

#### [Common](https://github.com/innovationacademy-kr/42cabi/)
- 유지/보수와 기능 추가가 용이하도록 코딩 컨벤션을 정하고, 문서화 작업 및 이슈 관리를 체계화했습니다.
- Notion, Slack 등의 협업 툴들을 이용하여 팀원 간 정보시차와 격차를 줄였습니다.
- 주기적이지만 유동적인 회의를 통해 목표와 분업을 명확히하여 효과적인 협업을 진행했습니다.
- 시설관리팀과 실사용자들과 끊임 없이 소통하면서 유저친화적인 서비스를 제공했습니다.

#### [FrontEnd](https://github.com/innovationacademy-kr/42cabi/tree/dev/frontend_v3)

- 웹, 모바일 환경에서도 이용에 불편함이 없도록 반응형 웹 디자인을 적용했습니다.
- 사용자가 쉽게 사물함을 찾을 수 있도록 실제 사용공간에 따른 맵을 표시했습니다.
- 원활한 유저 경험을 위해 페이지를 포함한 캐러셀을 구현했습니다.
- 사용자가 서비스 상태를 명확하게 인지할 수 있도록 로딩과 에러 코드에 따른 렌더링을 구현했습니다. 
- 정책이나 UI/UX 등 빠르게 변화하는 환경을 원활히 반영할 수 있도록 하드코딩을 피하고 props와 환경변수를 이용해 유지보수성을 높였습니다.

#### [BackEnd](https://github.com/innovationacademy-kr/42cabi/tree/dev/backend)

- 사용자가 층별로 캐비닛 정보를 조회할 때 빠른 응답속도를 위해 쿼리 최적화로 성능을 향상시켰습니다.
- 공유 사물함 서비스를 구현하며 캐비넷 대여/반납시 발생할 수 있는 여러 경우를 원활하게 제어하기 위해 캐비넷 상태에 따라 처리하게끔 DFA 알고리즘을 적용했습니다.
- 동시에 들어오는 요청에 대해 특정 요청이 실패할 경우, 무결성을 위해 대여/반납의 과정을 트랜잭션으로 관리하였으며 격리 수준 구별로 데드락을 방지했습니다.
- 블랙홀에 빠진 사용자(퇴학 처리된 유저)를 적절하게 처리하도록 42 API를 사용하였고 블랙홀 스케줄링을 고안, 적용했습니다.
- 기존 버전에서 Express.js로 작성된 코드를 IoC, DI, AOP를 이용, 유지보수에 유리한 Nest.js로 포팅했습니다.
- 불필요한 정보를 저장하는 컬럼을 제거, 트랜잭션의 로직을 재구성하는 등 DB 구조를 개선했습니다.

<br/>

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
    <td><img src="https://eslint.org/icon-512.png" width="15px" alt="_icon" /> ESLint</td>
    <td>코딩 컨벤션에 위배되거나 안티 패턴을 미리 검출하여 에러 발생 요소를 줄였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3256745/file-type-light-prettier-icon-md.png" width="15px" alt="_icon" /> Prettier</td>
    <td>기본적인 코딩룰 적용으로 가독성 향상 및 코드 양식을 통일했습니다.</td>
  </tr>
  <tr>
    <td rowspan="6" align="center">Front-End</td>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" width="15px" alt="_icon" /> React</td>
    <td>컴포넌트 기반의 UI 구현으로 재사용성을 높이고 상태 관리를 통해 성능을 최적화했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://img.icons8.com/color/480/redux.png" width="15px" alt="_icon" /> Redux</td>
    <td>API 요청 최소화 및 컴포넌트간 공유하는 상태를 효율적으로 관리하여 리렌더링을 최적화했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/20658825?s=200&v=4" width="15px" alt="_icon" /> styled-components</td>
    <td>CSS in JS를 통해 컴포넌트와 스타일 간의 의존성을 제거하여 컴포넌트 단위의 재사용성을 향상시켰습니다.</td>
  </tr>
  <tr>
    <td><img src="https://vitejs.dev/logo-with-shadow.png" width="15px" alt="_icon" /> Vite</td>
    <td>esbuild를 통한 빠른 번들링과 HMR을 통해 생산성을 향상시켰습니다.</td>
  </tr>
  <tr>
    <td><img src="https://mui.com/static/logo.png" width="15px" alt="_icon" /> material-UI</td>
    <td>안드로이드 시스템에서 검증된 신뢰성과 리액트와의 호환성을 바탕으로 생산성을 향상시켰습니다.</td>
      <!-- 명확하지 않은 표현인 것 같은데 작성해주실 분..? -->
  </tr>
  <tr>
    <td><img src="https://static-00.iconduck.com/assets.00/storybook-icon-icon-412x512-341bo8r1.png" width="15px" alt="_icon" /> Storybook</td>
    <td>공통 UI 컴포넌트 제작 시 컴포넌트를 독립적으로 만들고, 테스트하는 과정을 통해 생산성을 향상시켰습니다.</td>
  </tr>
  <tr>
    <td rowspan="5" align="center">Back-End</td>
    <td><img src="https://docs.nestjs.com/assets/logo-small.svg" width="15px" alt="_icon" /> NestJS</td>
    <td>Express.js 대비 낮은 자유도로 협업에 적합한 프레임워크로 판단했고, IoC, DI, AOP를 통해 유지보수성을 높였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://static-00.iconduck.com/assets.00/mariadb-icon-512x340-txozryr2.png" width="18px" alt="_icon" /> MariaDB</td>
    <td>활성화된 커뮤니티를 통해 여러 레퍼런스를 이용, 개발 중 발생하는 여러 문제들을 해결했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://seeklogo.com/images/T/typeorm-logo-F243B34DEE-seeklogo.com.png" width="15px" alt="_icon" /> TypeORM</td>
    <td>Raw query로 작성하는 것보다 용이하고 추후 다른 DBMS로 쉽게 전환 가능한 라이브러리로, 이를 이용해 유지보수성을 높였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://static-00.iconduck.com/assets.00/swagger-icon-512x512-halz44im.png" width="15px" alt="_icon" /> Swagger</td>
    <td>명확한 HTTP API 명세를 통해 프론트엔드/백엔드의 원활한 협업을 이뤘습니다.</td>
  </tr>
  <tr>
    <td><img src="http://www.passportjs.org/images/logo.svg" width="15px" alt="_icon" /> Passport</td>
    <td>OAuth2 인증 방식 적용에 용이한 라이브러리로, 서버 자체 토큰 및 42 인트라 인증에 사용했습니다.</td>
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
    <td><img src="https://raw.githubusercontent.com/unitech/pm2/master/pres/pm2.20d3ef.png" width="40px" alt="_icon" />PM2</td>
    <td>서버 앱 프로세스의 명확한 관리와 무중단 서비스에 사용했습니다.</td>
  </tr>
  <tr>
    <td><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" width="15px" alt="_icon" /> Docker</td>
      <td>컨테이너를 통해 통일된 로컬 개발환경을 설정하여 개발의 호환성을 높였습니다.</td>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/44036562?s=280&v=4" width="15px" alt="_icon" /> Github Actions</td>
    <td>CI/CD를 통해 테스트, 배포를 자동화하여 무중단 서비스를 지원, 효율성과 효과성을 높였습니다.</td>
  </tr>
</table>

</div>
<br/>

## 🧑‍💻 프로젝트 멤버




<div align="center">


| [🐇dongglee](https://github.com/leedonggyu1848) | [🍑 eunbikim](https://github.com/eunbi9n) | [🥔 gyuwlee](https://github.com/gyutato) | [🐬huchoi](https://github.com/hunjin-choi) | [👻 hybae](https://github.com/HyeonsikBae) |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------ | --------------------------------------- | ------------------------------------------ |



| [🍒 hyoon](https://github.com/kamg2218) | [🍏 hyospark](https://github.com/kyoshong) |  [🙉inshin](https://github.com/42inshin) | [🧑‍✈️ jaesjeon](https://github.com/Oris482) |  [🐶 jiwchoi](https://github.com/jiwon-choi) |
| ----------------------------------------- | ---------------------------------------- | ------------------------------------------ | --------------------------------------- | ------------------------------------------ |

| [🐯 joopark](https://github.com/joohongpark) | [🚀sanan](https://github.com/Ssuamje) | [🐻 seuan](https://github.com/aseungbo) |  [🤑seycho](https://github.com/SeyoungCho)  | [😺 sichoi](https://github.com/sichoi42)  |
| ----------------------------------------- | ------------------------------------------- | -------------------------------------------- | --------------------------------------- | ---------------------------------------- |

| [🍎 skim](https://github.com/subin195-09) | [🍪 spark](https://github.com/Hyunja27) | [✏️yooh](https://github.com/oyhoyhk) | [🪀 yoyoo](https://github.com/Yoowatney) | [🎒 yubchoi](https://github.com/yubinquitous) |
| ----------------------------------------- | ------------------------------------------- | -------------------------------------------- | --------------------------------------- | ---------------------------------------- |

|  <a href="https://github.com/innovationacademy-kr"><img src="https://img.shields.io/badge/42Seoul-000000?style=flat-square&logo=42&logoColor=white" /></a> | 
| ----------------------------------------- |



</div>
<br/>

<!-- ## 📚 위키(미완성)

<div align="center">

| 🤝 규칙                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 📝 명세서                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 🗂 백로그                                                                                                                                            | 🏃‍♂️ 스프린트                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 🙋‍♂️ 회의록                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 👯‍♀️ 스크럼                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/팀-목표">팀 목표</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/그라운드-룰">그라운드 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/git-전략">git 전략</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/네이밍-룰">네이밍 룰</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/React-코드-포맷">React 코드 포맷</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ESLint&Prettier">ESLint&Prettier</a></li></ul> | <ul><li><a href="https://www.figma.com/file/Jnu0QBCLdbRJ94G5jhzl8F/%EB%8F%99%EB%84%A4%ED%9B%84%EA%B8%B0?node-id=0%3A1">디자인 명세서</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/ERD">ERD</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/인프라 구조">인프라 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/프로젝트 폴더 구조">프로젝트 폴더 구조</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/API 명세서">API 명세서</a></li></ul> | <ul><li><a href="https://docs.google.com/spreadsheets/d/1dt-VD4Iwxucy0ygJFUK-5dqbiBJOHNPNBY00G2yfRPo/edit#gid=0">백로그 스프레드 시트</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스프린트">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스프린트">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스프린트">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 스프린트">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스프린트">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 회의록">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 회의록">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 회의록">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 회의록">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차 회의록">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 회의록">6주차</a></li></ul> | <ul><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/1주차 스크럼">1주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/2주차 스크럼">2주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/3주차 스크럼">3주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/4주차 스크럼">4주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/5주차">5주차</a></li><li><a href="https://github.com/boostcampwm-2021/WEB11/wiki/6주차 스크럼">6주차</a></li></ul> |

</div> -->
