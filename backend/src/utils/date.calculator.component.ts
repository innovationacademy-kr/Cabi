import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DateCalculator {
  private logger = new Logger(DateCalculator.name);

  /**
   * 날짜 차이 계산
   * @param begin
   * @param end
   * @returns days
   */
  async calDateDiff(begin: Date, end: Date): Promise<number> {
    this.logger.debug(`Called ${DateCalculator.name} ${this.calDateDiff.name}`);
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate();

    const beginYear = begin.getFullYear();
    const beginMonth = begin.getMonth();
    const beginDay = begin.getDate();

    const newEnd = new Date(endYear, endMonth, endDay);
    const newBegin = new Date(beginYear, beginMonth, beginDay);

    const diffDatePerSec = newEnd.getTime() - newBegin.getTime();
    const days = Math.ceil(diffDatePerSec / 1000 / 60 / 60 / 24);
    return days;
  }
}
