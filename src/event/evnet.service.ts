import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventInfoDto } from './dto/event-info.dto';
import { IEventRepository } from './repository/IEventRepository';

@Injectable()
export class EventService {
  constructor(private eventRepository: IEventRepository) {}

  // 유저 & 짝 유저의 event 정보 return
  async getEventInfo(intra_id: string): Promise<EventInfoDto[]> {
    try {
      return await this.eventRepository.getEventInfo(intra_id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // 이벤트 유저 추가
  async insertEventInfo(intra_id: string): Promise<void> {
    try {
      await this.eventRepository.insertEventInfo(intra_id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // 이벤트 정보 업데이트
  async updateEventInfo(intra_id: string): Promise<void> {
    try {
      await this.eventRepository.updateEventInfo(intra_id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // 이벤트 정보
  async checkEventInfo(intra_id: string): Promise<boolean> {
    try {
      return await this.eventRepository.checkEventInfo(intra_id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // 이벤트 당첨 가능 여부
  async checkEventLimit(): Promise<boolean> {
    try {
      return await this.eventRepository.checkEventLimit();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
