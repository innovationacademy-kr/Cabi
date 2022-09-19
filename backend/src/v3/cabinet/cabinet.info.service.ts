import { Injectable } from "@nestjs/common";
import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { LentInfoResponseDto } from "src/dto/response/lent.info.response.dto";
import { SpaceDataResponseDto } from "src/dto/response/space.data.response.dto";
import { SpaceDataDto } from "src/dto/space.data.dto";

@Injectable()
export class CabinetService {
    constructor() {}

    async getSpaceInfo(): Promise<SpaceDataResponseDto> {
        const location: string = "serom";
        const floors: number[] = [2, 4, 5];
        const space_data: SpaceDataDto[] = [{location, floors},];

        return { space_data };
    }

    async getCabinetInfoByParam(
        location: string,
        floor: number,
    ): Promise<LentInfoResponseDto> {

        return 
    }

    async getCabinetInfo(
        cabinetId: number,
    ): Promise<CabinetInfoResponseDto> {
        
        return 
    }
}