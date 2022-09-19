import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { LentInfoResponseDto } from "src/dto/response/lent.info.response.dto";
import { SpaceDataResponseDto } from "src/dto/response/space.data.response.dto";
import { SpaceDataDto } from "src/dto/space.data.dto";
import { ICabinetInfoRepository } from "./repository/cabinet.info.repository.interface";

@Injectable()
export class CabinetService {
    constructor(
        @Inject('ICabinetInfoRepository')
        private cabinetInfoRepository: ICabinetInfoRepository,
    ) {}

    async getSpaceInfo(): Promise<SpaceDataResponseDto> {
        // Note: 새롬관에서 serom으로 바꿨을 때 문제가 생기는지?
        const location: string = "serom";
        const floors: number[] = [2, 4, 5];
        const space_data: SpaceDataDto[] = [{location, floors},];

        return { space_data };
    }

    async getCabinetInfoByParam(
        location: string,
        floor: number,
    ): Promise<LentInfoResponseDto> {
        try {
            return this.cabinetInfoRepository.getFloorInfo(location, floor);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async getCabinetInfo(
        cabinetId: number,
    ): Promise<CabinetInfoResponseDto> {
        try {
            return this.cabinetInfoRepository.getCabinetInfo(cabinetId);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}