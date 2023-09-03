import ContentStatus from "@/types/enum/content.status.enum";

interface ContentStatusData {
  contentTitle: string;
  imagePath: string;
  background: string;
  rentalPeriod?: string;
  capacity?: string;
  contentText: string;
  pointColor: string;
}

export const manualContentData: Record<ContentStatus, ContentStatusData> = {
  [ContentStatus.PRIVATE]: {
    contentTitle: "개인 사물함",
    imagePath: "/src/assets/images/privateIcon.svg",
    background: "linear-gradient(to bottom, #A17BF3, #8337E5)",
    rentalPeriod: `${import.meta.env.VITE_PRIVATE_LENT_PERIOD}일`,
    capacity: "1인",
    contentText: `◦ 이용 방법<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; <strong>1인</strong>이 1개의 사물함을 사용합니다.<br />
    &nbsp;&nbsp;&nbsp;&nbsp; 최대 <strong>${
      import.meta.env.VITE_PRIVATE_LENT_PERIOD
    }일</strong>간 대여할 수 있습니다.<br/><br/>
    ◦ 페널티<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 연체 시 연체되는 일의 <strong>제곱 수만큼</strong> 페널티가 부과됩니다.
  `,
    pointColor: "#8ffac7",
  },
  [ContentStatus.SHARE]: {
    contentTitle: "공유 사물함",
    imagePath: "/src/assets/images/shareIcon.svg",
    background: "linear-gradient(to bottom, #7EBFFB, #406EE4)",
    rentalPeriod: "20일 * N명",
    capacity: "2~4인",
    contentText: `◦ 이용 방법<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 1개의 사물함을 <strong>최대 ${
      import.meta.env.VITE_SHARE_MAX_USER
    }인</strong>이 사용합니다. <strong>대여한 인원수 * ${
      import.meta.env.VITE_SHARE_LENT_PERIOD
    }일</strong>간 대여할 수 있습니다.<br/> &nbsp;&nbsp;&nbsp;&nbsp; 사물함 제목과 메모는 대여자들끼리 공유됩니다.<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 대여 만료 기간 이내 반납 시, <strong>잔여 기간의 인원수 / 1</strong>만큼 대여 기간이 감소됩니다.
    <br/><br/>
    ◦ 페널티<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 연체 시 연체되는 일의 <strong>제곱 수만큼</strong> 페널티가 부과됩니다.<br /><br />
  `,
    pointColor: "#f8f684",
  },
  [ContentStatus.CLUB]: {
    contentTitle: "동아리 사물함",
    imagePath: "/src/assets/images/clubIcon.svg",
    background: "linear-gradient(to bottom, #F473B1, #D72766)",
    rentalPeriod: "상세내용 참조",
    capacity: "동아리",
    contentText: `모집 기간에만 대여할 수 있습니다.
    <br />
    <strong>새로운 기수</strong>가 들어올 때 갱신됩니다.
    <br />
    사물함 대여는 
    <a
      href="https://42born2code.slack.com/archives/C02V6GE8LD7"
      target="_blank"
      title="슬랙 캐비닛 채널 새창으로 열기"
    >
      슬랙 캐비닛 채널
    </a>
    로 문의주세요.
    <br />
    상세 페이지가 제공되지 않습니다.
    <br />
    비밀번호는 동아리 내에서 공유하여 이용하세요.`,
    pointColor: "#47ffa7",
  },
  [ContentStatus.PENDING]: {
    contentTitle: "오픈예정",
    imagePath: "/src/assets/images/happyCcabi.png",
    background: "white",
    contentText: `사물함 반납 시, 해당 사물함은 즉시 <strong>오픈예정</strong> 상태가 됩니다.<br />
    오픈예정 상태의 사물함은 대여가 불가능합니다.<br />
    오픈예정 상태의 사물함은 <strong>반납일 기준 다음 날 오후 1시(13시)</strong> 사용가능 상태가 됩니다.<br/>
    당일 오픈되는 사물함은 <a
    href="https://42born2code.slack.com/archives/C02V6GE8LD7"
    target="_blank"
    title="슬랙 캐비닛 채널 새창으로 열기"
  >
    슬랙 캐비닛 채널</a>에서 확인하세요.`,
    pointColor: "#6f07f6",
  },
  [ContentStatus.IN_SESSION]: {
    contentTitle: "대기중",
    imagePath: "/src/assets/images/clock.svg",
    background: "#9F72FE",
    contentText: `공유 사물함 대여시 <strong>10분</strong>간의 대기 시간이 발생합니다.<br/>
    대기 시간 동안 <strong>공유 인원(2인~4인)</strong>이 형성되지 않으면 공유 사물함 대여는 <strong>취소</strong>됩니다.<br/>
    대기 시간 내 <strong>4명</strong>의 공유 인원이 형성되면 <strong>즉시</strong> 대여가 완료됩니다.<br/>
    대여 과정에서 생성된 <strong>초대 코드</strong>를 사용하여 공유 사물함에 입장할 수 있습니다.<br/>
    초대 코드를 <strong>3번 이상</strong> 잘못 입력하면 <strong>입장이 제한</strong>됩니다.<br /><br />
    `,
    pointColor: "#47ffa7",
  },
  [ContentStatus.EXTENSION]: {
    contentTitle: "연장권 이용방법 안내서",
    imagePath: "/src/assets/images/extensionTicket.svg",
    background: "#F5F5F7",
    contentText: `◦ 연장권 취득 조건<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;월 출석 시간이 <strong>120시간</strong> 이상일 시 연장권이 부여됩니다.<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;연장권은 <strong>매달 2일</strong> 지급됩니다.<br/><br/>
    ◦ 연장권 사용<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 연장권 사용 시, 대여 만료 기간이 <strong>1달(31일)</strong> 연장됩니다.<br/>
    &nbsp;&nbsp;&nbsp;&nbsp; 연장권은 <strong>해당 월의 마지막 날</strong>까지 사용 가능합니다.`,
    pointColor: "#9747FF",
  },
};