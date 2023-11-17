import styled from "styled-components";
import Card, { IButtonProps } from "@/components/Card/Card";

type ProfileProps = {
  name: string | null;
  button: IButtonProps;
};

const ProfileCard = ({ name, button }: ProfileProps) => {
  return (
    <Card
      title={"프로필"}
      gridArea={"profile"}
      width={"350px"}
      height={"163px"}
      buttons={[button]}
    >
      <ProfileContent>
        <ProfileImage src="/src/assets/images/logo.png" alt="Profile Avatar" />
        <ProfileDetailWrapper>
          <ProfileDetail>{name}</ProfileDetail>
          <ProfileDetail>{name}@student.42seoul.kr</ProfileDetail>
        </ProfileDetailWrapper>
      </ProfileContent>
    </Card>
  );
};

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 20px;
`;

const ProfileDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileDetail = styled.div`
  padding: 5px 0 0 0;
`;

export default ProfileCard;
