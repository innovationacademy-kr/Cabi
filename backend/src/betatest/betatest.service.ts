import { Inject, Injectable, Logger } from '@nestjs/common';
import { IBetatestRepository } from './repository/betatest.repository.interface';

@Injectable()
export class BetatestService {
  private logger = new Logger(BetatestService.name);

  constructor(
    @Inject('IBetatestRepository')
    private betatestRepository: IBetatestRepository,
  ) {}

  async deleteBanLog(user_id: number): Promise<boolean> {
    return await this.betatestRepository.deleteBanLog(user_id);
  }
}
