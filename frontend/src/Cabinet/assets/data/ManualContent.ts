import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as ClockImg } from "@/Cabinet/assets/images/clock.svg";
import { ReactComponent as ClubIcon } from "@/Cabinet/assets/images/clubIcon.svg";
import { ReactComponent as DollarImg } from "@/Cabinet/assets/images/coinDolar.svg";
import { ReactComponent as ExtensionIcon } from "@/Cabinet/assets/images/extension.svg";
import { ReactComponent as PrivateIcon } from "@/Cabinet/assets/images/privateIcon.svg";
import { ReactComponent as ShareIcon } from "@/Cabinet/assets/images/shareIcon.svg";
import { ReactComponent as StoreImg } from "@/Cabinet/assets/images/storeIconGray.svg";
import ContentStatus from "@/Cabinet/types/enum/content.status.enum";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";

interface ContentStatusData {
  contentTitle: string;
  iconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null;
  background: string;
  rentalPeriod?: string;
  capacity?: string;
  contentText: string;
  pointColor: string;
}

interface ItemStatusData {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  content: string;
}

export const manualContentData: Record<ContentStatus, ContentStatusData> = {
  [ContentStatus.PRIVATE]: {
    contentTitle: "개인 사물함",
    iconComponent: PrivateIcon,
    background:
      "linear-gradient(to bottom, var(--ref-purple-400), var(--ref-purple-600))",
    rentalPeriod: `${import.meta.env.VITE_PRIVATE_LENT_PERIOD}일`,
    capacity: "1인",
    contentText: `<span>◦ 이용 방법</span><br/>
    <div>
    <strong>1인</strong>이 1개의 사물함을 사용합니다.<br />
    최대 <strong>${
      import.meta.env.VITE_PRIVATE_LENT_PERIOD
    }일</strong>간 대여할 수 있습니다.<br/><br/>
    </div>
    <span>◦ 페널티</span><br/>
    <div>
    연체 시 연체되는 일의 <strong>제곱 수만큼</strong> 페널티가 부과됩니다.<br />
    연체 페널티는 누적됩니다.
    </div>
  `,
    pointColor: "var(--white-text-with-bg-color)",
  },
  [ContentStatus.SHARE]: {
    contentTitle: "공유 사물함",
    iconComponent: ShareIcon,
    background:
      "linear-gradient(to bottom, var(--ref-blue-300), var(--ref-blue-600))",
    rentalPeriod: `${import.meta.env.VITE_SHARE_LENT_PERIOD}일 + n * ${
      import.meta.env.VITE_SHARE_BONUS_PER_PERSON
    }`,
    capacity: `${import.meta.env.VITE_SHARE_MIN_USER} ~ ${
      import.meta.env.VITE_SHARE_MAX_USER
    }인`,
    contentText: `<span>◦ 이용 방법</span><br/>
    <div>1개의 사물함을 <strong>최대 ${
      import.meta.env.VITE_SHARE_MAX_USER
    }인</strong>이 사용합니다.<br/><strong>${
      import.meta.env.VITE_SHARE_LENT_PERIOD
    }일 + 대여한 인원수 * ${
      import.meta.env.VITE_SHARE_BONUS_PER_PERSON
    }일</strong>간 대여할 수 있습니다.<br/>사물함 제목과 메모는 대여자들끼리 공유됩니다.<br/>
    대여 만료 기간 이내 반납 시,<br/><strong>(잔여 인원 / 기존 인원) * 기존 잔여 기간</strong>으로 잔여 기간이 산정됩니다.
    <br/>대여 인원 확정 후, 공유 사물함 중도 참여는 불가능합니다.<br/><br/> 
    </div>
    <span>◦ 페널티</span><br/>
    <div>
    연체 시 연체되는 일의 <strong>제곱 수만큼</strong> 페널티가 부과됩니다.<br />
    연체 페널티는 누적됩니다.
    </div>
  `,
    pointColor: "var(--white-text-with-bg-color)",
  },
  [ContentStatus.CLUB]: {
    contentTitle: "동아리 사물함",
    iconComponent: ClubIcon,
    background:
      "linear-gradient(to bottom, var(--ref-pink-100), var(--ref-pink-300))",
    rentalPeriod: "상세내용 참조",
    capacity: "동아리",
    contentText: `<span>◦ 이용 방법</span><br/>
    <div>
    모집 기간에만 대여할 수 있습니다.
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
    비밀번호는 동아리 내에서 공유하여 이용하세요.</div>`,
    pointColor: "var(--white-text-with-bg-color)",
  },
  [ContentStatus.PENDING]: {
    contentTitle: "오픈예정",
    iconComponent: null,
    background: "var(--sys-main-color)",
    contentText: `<span>◦ 상세 내용</span><br/>
    <div>사물함 반납 시, 해당 사물함은 오픈예정 상태로 변경됩니다.<br />
    오픈예정 상태의 사물함은 대여가 불가능합니다.<br />
    <strong>반납일 기준 다음 날 오후 1시(13시)</strong> 사용가능 상태가 됩니다.<br/>
    당일 오픈되는 사물함은 <a
    href="https://42born2code.slack.com/archives/C02V6GE8LD7"
    target="_blank"
    title="슬랙 캐비닛 채널 새창으로 열기"
  >
    슬랙 캐비닛 채널</a>에서 확인하세요.</div>`,
    pointColor: "var(--white-text-with-bg-color)",
  },
  [ContentStatus.IN_SESSION]: {
    contentTitle: "대기중",
    iconComponent: ClockImg,
    background: "var(--card-bg-color)",
    contentText: `<span>◦ 상세 내용</span><br/>
    <div>공유 사물함 대여 시 <strong>10분</strong>간의 대기 시간이 발생합니다.<br/>
    대여 과정에서 생성된 <strong>초대 코드</strong>를 통해 공유 사물함에 입장할 수 있습니다.<br/>
    <strong>${
      import.meta.env.VITE_SHARE_MAX_USER
    }인</strong>의 공유 인원이 형성되면 즉시 대여가 완료됩니다.<br/>
    대기 시간 동안 <strong>공유 인원(${
      import.meta.env.VITE_SHARE_MIN_USER
    }인 ~ ${
      import.meta.env.VITE_SHARE_MAX_USER
    }인)</strong>이 형성되지 않으면<br/>사물함 대여가 취소되며, 공유 사물함은 다시 대여 가능 상태가 됩니다.<br/><br/></div>
    <span>◦ 주의 사항</span><br/>
    <div>초대 코드를 <strong>3번 이상</strong> 잘못 입력하면 <strong>입장이 제한</strong>됩니다.</div>
    `,
    pointColor: "var(--sys-main-color)",
  },
  [ContentStatus.EXTENSION]: {
    contentTitle: "연장권 이용방법 안내서",
    iconComponent: ExtensionIcon,
    background: "var(--card-bg-color)",
    contentText: `<span>◦ 연장권 취득 조건</span><br/>
    <div>
    월 출석 시간이 <strong>기준 시간</strong> 이상일 시 연장권이 부여됩니다.<br/>
    출석 시간 기준은 기본적으로 <strong>지원금 산정 기준</strong>과 동일합니다.<br/>
    연장권은 <strong>매달 2일</strong> 지급됩니다.<br/><br/>
    </div>
    <span>◦ 연장권 사용</span><br/>
    <div>
    연장권 사용 시, 대여 만료 기간이 <strong>${
      import.meta.env.VITE_EXTENDED_LENT_PERIOD
    }일</strong> 연장됩니다.<br/>
    개인 및 공유 사물함에 적용 가능합니다.<br/>
    연장권은 <strong>해당 월의 마지막 날</strong>까지 사용 가능합니다.<br/>
    공유 사물함에 한 명만 남거나 연체된 상태라면 연장권 사용이 불가합니다.
    </div>`,
    pointColor: "var(--normal-text-color)",
  },
  [ContentStatus.COIN]: {
    contentTitle: `코인 사용법`,
    iconComponent: DollarImg,
    background: "var(--card-bg-color)",
    contentText: `<span>◦ 160시간 출석하기</span><br/>
    <div>
    42 출석 <strong>160시간</strong>을 채운다면 다음달 2일에 <strong>2000까비</strong>가 지급됩니다.<br />
    <br />
    </div>
    <span>◦ 동전줍기</span><br/>
    <div>
    Cabi 홈페이지에 접속해, <strong>하루에 한 번</strong> 동전을 주울 수 있습니다.<br />
    한 달 동안 20개의 코인을 모두 줍는다면 <strong>랜덤 보상</strong>이 주어집니다.<br />
    <br />
    </div>
    <span>◦ 수요지식회 발표하기</span><br/>
    <div>
    수요지식회 발표자 분께 <strong>1000까비</strong>를 지급해 드립니다.<br />
    수요지식회 신청은 왼쪽 상단의<strong>수요지식회 홈페이지</strong>에서 신청할 수 있습니다.<br />
    </div>

    `,
    pointColor: "var(--sys-default-main-color)",
  },
  [ContentStatus.STORE]: {
    contentTitle: "까비 상점 OPEN!",
    iconComponent: StoreImg,
    background:
      "linear-gradient(to bottom, var(--ref-purple-400), var(--ref-purple-600))",
    contentText: `
  `,
    pointColor: "var(--white-text-with-bg-color)",
  },
};

export const manualItemsData: Record<StoreItemType, ItemStatusData> = {
  [StoreItemType.EXTENSION]: {
    icon: ItemIconMap.EXTENSION,
    title: "연장권",
    content: `
  <strong>store</strong> 탭을 눌러 연장권 구매하기 버튼을 클릭 후 <strong>3일</strong>, <strong>15일</strong>, <strong>31일</strong> 단위로 구매할 수 있습니다.<br/>
  구매한 아이템은 <strong>인벤토리</strong> 탭에서 확인할 수 있습니다.<br/>
  <br/>
  <span>◦ 사용방법</span><br/>
  <div>
  사물함을 대여한 상태로, <strong>상단 오른쪽의 상자 아이콘</strong>을 누르면 현재 자신의 <strong>사물함의 정보</strong>를 볼 수 있습니다.<br/>
  <strong>연장권 사용하기</strong> 버튼을 눌러 보유한 연장권 중 원하는 <strong>타입을 선택</strong> 후 사용합니다.<br/>
  이미 사용한 연장권은 취소할 수 없습니다.<br/>
  공유사물함의 모든 인원이 연장권을 사용할 수 있지만, <strong>남은 인원이 한 명인 경우 연장권을 사용할 수 없습니다.</strong>
  </div>
  `,
  },
  [StoreItemType.SWAP]: {
    icon: ItemIconMap.SWAP,
    title: "이사권",
    content: `
  <strong></strong>
  기존 일주일에 한 번 가능했던 이사하기 기능을 <strong>제한 없이 자유롭게</strong> 사용할 수 있습니다.<br/>
  현재 이용중인 사물함의 <strong>대여 기간을 유지</strong>한 채 다른 사물함으로 이사할 수 있습니다.<br/>
  store 탭에서 구매할 수 있으며, 인벤토리 탭에서 구매한 아이템을 확인할 수 있습니다.
  <br/>
  <span>◦ 사용방법</span><br/>
  <div>
  <strong>개인 사물함을 이용중인 사용자</strong>만 이사권을 사용할 수 있습니다.<br/>
  아이템을 보유한 상태로 <strong>비어있는 개인 사물함</strong>을 눌렀을 때 이사하기 버튼이 활성화됩니다.<br/>
  이미 사용한 이사권은 취소할 수 없습니다.<br/>
  
  </div>
  `,
  },
  [StoreItemType.ALARM]: {
    icon: ItemIconMap.ALARM,
    title: "알림 등록권",
    content: `
  내가 원하는 섹션에 <strong>빈 자리</strong>가 나온다면 알림을 받을 수 있습니다.<br/>
  <strong>개인사물함</strong>에 대해서만 알림을 받을 수 있습니다.<br/>
  store 탭에서 구매할 수 있으며, 인벤토리 탭에서 구매한 아이템을 확인할 수 있습니다.<br/>
  <br/>
  <span>◦ 사용방법</span><br/>
  <div>
  아이템 구매 후 원하는 섹션으로 이동해 우측 상단의 <strong>하트 아이콘</strong>을 클릭합니다.<br/>
  사용한 알림 등록권은 섹션을 변경하거나 취소할 수 없습니다.<br/>
  알림등록권은 1회 알림 후 <strong>소멸</strong>됩니다.
  </div>

  `,
  },
  [StoreItemType.PENALTY]: {
    icon: ItemIconMap.PENALTY,
    title: "페널티 감면권",
    content: `
  페널티 감면권은 <strong>7일</strong>, <strong>15일</strong>, <strong>31일</strong> 단위로 구매할 수 있습니다. <br/>
  구매한 아이템은 <strong>인벤토리</strong> 탭에서 확인할 수 있습니다.<br/>
  <br/>
  <span>◦ 사용방법</span><br/>
  <div>
  사물함 대여 불가 페널티가 부과된 유저라면 Profile 탭을 눌러 대여정보 상자 상단의 <br/>
  <strong>페널티 감면권 사용하기 버튼</strong>이 활성화됩니다.<br/>
  버튼을 눌러 내가 보유한 페널티 감면권을 선택하면, 남은 페널티 기간을 확인하실 수 있습니다.<br/>
  연체된 사물함을 아직 반납하지 않았다면, 우선 <strong>반납하기 버튼</strong>을 눌러야 사용 버튼이 활성화됩니다.
  </div>
  `,
  },
};
