export interface ISlackChannel {
  title: string;
  channelId: string;
}

export const SlackChannels: ISlackChannel[] = [
  {
    title: "#random",
    channelId: "CU6MTFBNH",
  },
  {
    title: "#club_cabinet",
    channelId: "C02V6GE8LD7",
  },
];

export interface ISlackAlarmTemplate {
  title: string;
  content: string;
}

export const SlackAlarmTemplates: ISlackAlarmTemplate[] = [
  {
    title: "점검 시작",
    content: `:alert::alert::alert:<Cabi 서비스 점검 공지>:alert::alert::alert:

:happy_ccabi: 안녕하세요. Cabi 팀입니다! :happy_ccabi:
:sad_ccabi: 서비스 개선을 위해, 서버를 점검하게 되었습니다. :sad_ccabi:
:file_cabinet: 서비스 개선과 관련한 사항은  Cabi 채널 에서, :file_cabinet:
:hammer_and_wrench: 보관물 관련 사항은 *데스크에 직접 문의*해주세요! :hammer_and_wrench:

점검 일자 : 2024년 04월 02일 (화요일)
점검 시간 : 15시 10분 ~ 완료 공지 시점까지

:party-dinosaur::party-dinosaur::party-dinosaur::party-dinosaur:잠시만 기다려주세요! :party-dinosaur::party-dinosaur::party-dinosaur::party-dinosaur:`,
  },
  {
    title: "점검 완료",
    content: `:dancing_kirby::dancing_kirby::dancing_kirby:<Cabi 서비스 점검 완료 공지>:dancing_kirby::dancing_kirby::dancing_kirby:

안녕하세요. Cabi 팀입니다! :happy_ccabi:
현시간부로 서비스 이용이 정상화되었습니다.

:portal_blue_parrot: 서비스는 cabi.42seoul.io 를 이용해주시면 됩니다. :portal_orange_parrot:
:file_cabinet: 서비스 개선과 관련한 사항은 Cabi 채널 문의주세요! :file_cabinet:

:party-dinosaur::party-dinosaur::party-dinosaur::party-dinosaur:기다려주셔서 감사합니다! :party-dinosaur::party-dinosaur::party-dinosaur::party-dinosaur:`,
  },
  {
    title: "업데이트",
    content: `:dancing_kirby::dancing_kirby::dancing_kirby:<Cabi 동아리 기능 업데이트 내용 안내>:dancing_kirby::dancing_kirby::dancing_kirby:

:happy_ccabi:동아리 장분들의 동아리 기능 사용 방법:happy_ccabi:
===============================================
내용
===============================================

:point_right: 서비스는 cabi.42seoul.io 를 이용해주시면 됩니다. :point_left:`,
  },
  {
    title: "이용 안내서",
    content: `:file_cabinet: Cabi 이용 안내서 :file_cabinet:


:embarrassed_cabi: 42seoul의 사물함 대여 서비스를 운영중인 Cabi 팀입니다.:embarrassed_cabi:
자세한 이용 방법은 Cabi 가입 후 홈페이지의 이용 안내서를 참고해 주세요!
:point_right: https://cabi.42seoul.io/home


:alert: Cabi FAQ :alert:

:pushpin: 사물함의 물리적인 문제가 있습니다 (고장 났거나 잠겨있는 경우)
:happy_ccabi: 사물함의 물리적인 문제는 데스크에 문의 부탁드립니다!

:pushpin: 사물함 비밀번호를 모릅니다 (잊어버렸습니다).
:happy_ccabi: 저희 서비스에서 대여한 화면과 슬랙 화면을 준비해서 데스크에 문의해주시기 바랍니다!

:pushpin: 사물함을 닫으려는데 빨간 열쇠 표시가 뜨면서 경고음이 나고 잠기지 않습니다.
:happy_ccabi: 사물함 안이 꽉 차거나 제대로 닫히지 않은 경우에 발생하는데, 문을 누른 상태로 비밀번호를 입력해 보시고, 그래도 되지 않는다면 데스크에 문의 부탁드립니다!

:pushpin: 사물함 대여 후 사용하려고 했더니 안에 짐이 가득 차 있습니다.
:happy_ccabi: 이전 사용자의 짐과 관련한 문의는 데스크에 문의 부탁드립니다!

:pushpin: 공유 사물함을 대여했는데 비밀번호는 어디서 알 수 있을까요?
:happy_ccabi: 같이 사용하는 사람이 있다면 대여 내역에서 공유 메모에 적혀 있을 수 있습니다. 또는 함께 사용하는 분에게 여쭤보세요!

:pushpin: 사물함을 연체 했는데 페널티는 무엇인가요?
:happy_ccabi: 연체일만큼 누적 연체일이 증가하고, 누적일 만큼 대여가 불가능합니다:face_holding_back_tears:`,
  },
  {
    title: "모집 공고",
    content: `:white_check_mark: 까비 소개 링크, 구글폼 링크 추가 :white_check_mark:

:embarrassed_cabi::embarrassed_cabi::embarrassed_cabi: <Cabi팀 n기 모집 공고> :embarrassed_cabi::embarrassed_cabi::embarrassed_cabi:

안녕하세요 Cabi 팀입니다!
새로운 팀원 모집 공고를 올립니다:yesyes:
많은 관심 부탁드립니다!
----------------------------------------------------
:dancing_kirby:모집개요:dancing_kirby:
오늘 {날짜} 부터, {날짜} 23:59까지!
까비 팀의 프론트엔드 / 백엔드 n기 신청을 받습니다!
폼 작성 - 간단한 미팅 - 최종 발표 예정입니다!


:file_cabinet: 저희 서비스는요…:file_cabinet:
사물함 대여 서비스: 42서울의 사물함 400여 개를 편리하게 대여 및 반납할 수 있는 서비스입니다.
효율적이고 원활한 서비스: 제한된 자원으로 많은 사용자가 원활… (더보기)


:hammer_and_wrench: 사용중인 기술 스택 :hammer_and_wrench:
프론트: :typescript: / :reactjs: / Recoil
백: :java: / Spring / Spring Boot / JPA / QueryDSL / MariaDB / Redis
인프라: :aws: EC2, RDS, S3, CloudFront, CodeDeploy / Docker / Github Actions / Pinpoint APM / Grafana / Prometheus
:star::star::star::star:위에 있는 기술들을 모르셔도 상관 없습니다!!:star::star::star::star:


:thumbsup_ccabi: 까비 팀에 합류하시면... :thumbsup_ccabi:
월 약 1300명의 유저가 사용하는 서비스를 직접 기획 / 운영 / 개발하기!
메인, 어드민 서비스 유지 및 보수!
친절하고 유쾌한 까비 팀원들과 친해지기!
체계적인 협업 컨벤션과 코드 리뷰!
트러블 슈팅과 기술 아카이브로 포트폴리오 해결!
42Seoul Cabinet System Developer 칭호까지!


:cat_thumbs: 다음과 같은 아이템을 염두하고 있어요! :cat_thumbs:
재화 시스템 - 기존 상점 페이지에 새로운 아이템 추가 및 고도화
수요지식회 - Cabi 페이지에 합쳐진 수요지식회 페이지 분리 및 후기 기능 추가
성능 최적화 - Lighthouse 지표 개선


:pushpin: 이런 분을 우대합니다!
- 블랙홀이 넉넉하신 분!
- 많은 시간을 까비에 할애할 수 있으신 분!
- 열정 넘치시는 분!


:four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover:
:four_leaf_clover::arrow_right:지금 바로 지원하기:arrow_left::four_leaf_clover:
:four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover::four_leaf_clover:

:man-bowing: 상세한 정보는 구글 폼을 참고해주시고, 이외에 모집과 관련한 문의는
@담당자 에게 DM 부탁드립니다! :man-bowing:`,
  },
  {
    title: "동아리 사물함",
    content: `:happy_ccabi: 안녕하세요 사물함 서비스를 운영중인 Cabi 팀입니다 :happy_ccabi:

이번 동아리 사물함 모집을 공지드립니다!
기존 {날짜} 에 신청하셨던 분들도 재신청해주시기를 바랍니다.
신청 링크 : {링크}
내용은 아래와 같습니다.
-----------------------------------------------------
< :hourglass_flowing_sand: 모집 기간 >
2024년 동아리 사물함 신청은 일주일 동안 진행됩니다.
3월 15일(금) 부터
~ 3월 22일(금) 23:59 까지 입니다.
*이 시간대 외의 신청은 유효하지 않은 신청으로 간주됩니다:disappointed_relieved:
-----------------------------------------------------
< :pushpin: 선발 기준 >
[스프레드 시트에 등록된] 42 Seoul 동아리 리스트에 포함된 동아리
신청자 수가 사물함보다 많을경우 추첨으로 진행됩니다.
-----------------------------------------------------
< :mantelpiece_clock: 발표일 >
10월 20일 오후 중 발표 예정입니다!
해당 발표 결과는 슬랙의 ‘42seoul_club_cabinet’, ‘42seoul_global_random’ 채널에 공지 드릴 예정입니다.
사물함 배정이 완료된 후 동아리 사물함 대표분들에게, 슬랙 DM으로 메시지가 전송될 예정입니다.
-----------------------------------------------------
< :man-tipping-hand: 유의사항 >
1. 기존에 동아리 사물함을 사용중이셨다면, 새로이 사용하는 동아리들의 원활한 이용을 위해서
3월 22일(금)까지 사물함을 비워주시기 바랍니다!
2. 위 모든 내용은 상황에 따라 변경될 수 있으며 차후에도 변경될 수 있습니다.
이 때에는 재공지될 예정입니다!
-----------------------------------------------------
< :telephone_receiver: 문의사항 >
슬랙의 ‘42seoul_club_cabinet’ 채널에 문의해주시면 됩니다! :sunglasses:`,
  },
  {
    title: "연체",
    content: `[CABI] 안녕하세요! :embarrassed_cabi:
현재 이용 중이신 사물함이 연체인 것으로 확인되어 연락드립니다.
장기간 연체시 서비스 이용에 대한 페널티, 혹은 :tig:가 부여될 수 있음을 인지해주세요!
사물함의 대여 기간을 확인하신 후 반납 부탁드립니다.
항상 저희 서비스를 이용해 주셔서 감사합니다:)`,
  },
];
