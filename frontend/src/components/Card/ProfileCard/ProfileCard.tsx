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
          <EmailDetail>{name}@student.42seoul.kr</EmailDetail>
        </ProfileDetailWrapper>
      </ProfileContent>
    </Card>
  );
};

const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px;
  width: 90%;
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
  width: 100%;
`;

const ProfileDetail = styled.div`
  padding: 5px 0 0 0;
`;

const EmailDetail = styled(ProfileDetail)`
  font-size: 0.9rem;
`;

export default ProfileCard;
