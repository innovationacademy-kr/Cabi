import CabinetTemplate from "../components/templates/CabinetTemplate";
import FooterTemplate from "../components/templates/FooterTemplate";
import CabinetBoxButton from "../components/atoms/buttons/CabinetBoxButton";
import ContentTemplate from "../components/templates/ContentTemplate";

/*
interface UserDto {
  user_id: number; // 42 고유 ID
  intra_id: string; // 42 로그인 ID
  email?: string; // 42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)
}

let sample1: UserDto[] = [
  {
    user_id: 1,
    intra_id: "hybae",
  },
];
let sample2: UserDto[] = [
  {
    user_id: 2,
    intra_id: "",
  },
];
let sample3: UserDto[] = [
  {
    user_id: 3,
    intra_id: "joopark",
  },
];
let sample4: UserDto[] = [
  {
    user_id: 4,
    intra_id: "sichoi",
  },
  {
    user_id: 5,
    intra_id: "gyuwlee",
  },
  {
    user_id: 6,
    intra_id: "hybae",
  },
];
*/

const Main = (): JSX.Element => {
  return (
    <>
      {/*
        <div style={{ display: "flex" }}>
          <CabinetBoxButton
            cabinet_type={"PRIVATE"}
            cabinet_number={1}
            is_expired={false}
            lender={sample1}
            isLent={1}
            user={"hybae"}
          />
          <CabinetBoxButton
            cabinet_type={"SHARE"}
            cabinet_number={2}
            is_expired={false}
            lender={sample2}
            isLent={0}
            user={"hybae"}
          />
          <CabinetBoxButton
            cabinet_type={"PRIVATE"}
            cabinet_number={3}
            is_expired={false}
            lender={sample3}
            isLent={0}
            user={"hybae"}
          />
          <CabinetBoxButton
            cabinet_type={"SHARE"}
            cabinet_number={4}
            is_expired={false}
            lender={sample4}
            isLent={1}
            user={"hybae"}
          />
        </div>
  */}
      <ContentTemplate>
        <CabinetTemplate />
      </ContentTemplate>
      <FooterTemplate />
    </>
  );
};

export default Main;
