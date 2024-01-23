import { ClubInfoResponseDto } from "@/types/dto/club.dto";

const ClubInfo = ({
  clubInfo,
}: {
  clubInfo: ClubInfoResponseDto | undefined;
}) => {
  return (
    <div>
      <h1>ClubInfo</h1>
    </div>
  );
};

export default ClubInfo;
