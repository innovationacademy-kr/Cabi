import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { LentInfoResponseDto } from "src/dto/response/lent.info.response.dto";
import { SpaceDataResponseDto } from "src/dto/response/space.data.response.dto";

export class CabinetService {
    constructor() {}

    async getSpaceData(): Promise<SpaceDataResponseDto> {

        return 
    }

    async getCabinetInfoByFloor(
        location: string,
        floor: string,
    ): Promise<CabinetInfoResponseDto> {

        return 
    }

    async getCabinetInfo(
        cabinetId: string,
    ): Promise<LentInfoResponseDto> {
        
        return 
    }
}