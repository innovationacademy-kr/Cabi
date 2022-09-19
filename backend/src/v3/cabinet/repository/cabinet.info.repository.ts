import { InjectRepository } from "@nestjs/typeorm";
import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { LentInfoResponseDto } from "src/dto/response/lent.info.response.dto";
import Cabinet from "src/entities/cabinet.entity";
import { Repository } from "typeorm";
import { ICabinetInfoRepository } from "./cabinet.info.repository.interface";

export class CabinetInfoRepository implements ICabinetInfoRepository {
    constructor(
        @InjectRepository(Cabinet)
        private cabinetInfoRepository: Repository<Cabinet>,
    ) {}

    async getFloorInfo(location: string, floor: number): Promise<LentInfoResponseDto> {

        return 
    }

    async getCabinetInfo(cabinet_id: number): Promise<CabinetInfoResponseDto> {

        return 
    }
}