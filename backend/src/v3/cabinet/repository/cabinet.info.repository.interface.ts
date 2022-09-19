import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { LentInfoResponseDto } from "src/dto/response/lent.info.response.dto";

export abstract class ICabinetInfoRepository {
    /**
     * 특정 건물과 층에 존재하는 사물함의 정보를 가져옵니다.
     * 
     * @return LentInfoResponseDto
     */
    abstract getCabinetsInfo(location: string, floor: number): Promise<LentInfoResponseDto>;

    /**
     * 특정 사물함의 정보를 가져옵니다.
     * 
     * @return CabinetInfoResponstDto
     */
    abstract getCabinetInfo(cabinet_id: number): Promise<CabinetInfoResponseDto>;
}