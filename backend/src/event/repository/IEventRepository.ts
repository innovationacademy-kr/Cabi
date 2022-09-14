import { EventInfoDto } from '../dto/event.info.dto';

export abstract class IEventRepository {
  /**
   *
   * 깐부를 찾아라 이벤트
   * 전달 된 intra_id의 이벤트 정보와 짝의 이벤트 정보를 리턴합니다.
   * @param intra_id
   * @returns EventInfoDto[]
   */
  abstract getEventInfo(intra_id: string): Promise<EventInfoDto[]>;

  /**
   *
   * 전달 된 intra_id의 이벤트 정보를 추가합니다.
   * @param intra_id
   */
  abstract insertEventInfo(intra_id: string): Promise<void>;

  /**
   *
   * 전달 된 intra_id의 이벤트 정보를 업데이트합니다.
   * @param intra_id
   */
  abstract updateEventInfo(intra_id: string): Promise<void>;

  /**
   *
   * 전달 된 intra_id의 이벤트 정보를 리턴합니다.
   * @param intra_id
   * @returns boolean
   */
  abstract checkEventInfo(intra_id: string): Promise<boolean>;

  /**
   *
   * 이벤트 당첨 가능 유무를 리턴합니다.
   * @returns boolean
   */
  abstract checkEventLimit(): Promise<boolean>;
}
