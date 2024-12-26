import SearchCabinetDetails from "@/Cabinet/components/Search/SearchCabinetDetails";
import SearchNoCabinetDetails from "@/Cabinet/components/Search/SearchNoCabinetDetails";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";

interface ISearchDetail {
  name: string;
  userId: number;
  cabinetInfo?: CabinetInfo;
  bannedAt?: Date;
  unbannedAt?: Date;
  searchValue: string;
}

const SearchItemByIntraId = (props: ISearchDetail) => {
  const { name, userId, cabinetInfo, bannedAt, unbannedAt, searchValue } =
    props;
  return (
    <>
      {cabinetInfo?.cabinetId ? (
        <SearchCabinetDetails
          name={name}
          userId={userId}
          cabinetInfo={cabinetInfo}
          bannedAt={bannedAt}
          unbannedAt={unbannedAt}
          searchValue={searchValue}
        />
      ) : (
        <SearchNoCabinetDetails
          name={name}
          userId={userId}
          searchValue={searchValue}
        />
      )}
    </>
  );
};

export default SearchItemByIntraId;
