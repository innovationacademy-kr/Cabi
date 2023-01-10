import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { LogPagenationDto } from '../dto/log.pagenation.dto';
  import { ILogRepository } from 'src/admin/log/repository/log.interface.repository';
  
  @Injectable()
  export class LogService {
    private logger = new Logger(LogService.name);
  
    constructor(
      @Inject('ILogRepository')
      private logRepository: ILogRepository,
    ) {}
  
    /**
     * 특정 유저의 사물함 대여 기록을 반환합니다.
     *
     * @param user_id 유저 고유 ID
     * @param index 가져올 데이터 인덱스
     * @param length 가져올 데이터 길이
     * @returns LogPagenationDto
     * @throw HTTPError
     */
    async getLentLogByUserId(
      user_id: number,
      index: number,
      length: number,
    ): Promise<LogPagenationDto> {
      const result = await this.logRepository.getLentLogByUserId(user_id, index, length);
      if (index !== 0 && length !== 0 && result.total_length === 0) {
        throw new BadRequestException('Index Error');
      }
      return result;
    }
  
    /**
     * 특정 사물함의 대여 기록을 반환합니다.
     *
     * @param cabinet_id 캐비넷 고유 ID
     * @param index 가져올 데이터 인덱스
     * @param length 가져올 데이터 길이
     * @returns LogPagenationDto
     * @throw HTTPError
     */
    async getLentLogByCabinetId(
      cabinet_id: number,
      index: number,
      length: number,
    ): Promise<LogPagenationDto> {
      const result = await this.logRepository.getLentLogByCabinetId(
        cabinet_id,
        index,
        length,
      );
      if (index !== 0 && length !== 0 && result.total_length === 0) {
        throw new BadRequestException('Index Error');
      }
      return result;
    }
  }