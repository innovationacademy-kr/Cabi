import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { UserDto } from 'src/dto/user.dto';
import { LentService } from 'src/lent/lent.service';
import { DateCalculator } from './date.calculator.component';

@Injectable()
export class LeaveAbsence {
  private logger = new Logger(LeaveAbsence.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(LentService) private readonly lentService: LentService,
    @Inject(DateCalculator) private readonly dateCalculator: DateCalculator,
  ) {}

  async returnLeaveAbsenceStudent(user: UserDto, token: string): Promise<void> {
    const url = `https://api.intra.42.fr/v2/users/${user.intra_id}`;
    const headersRequest = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const data = await firstValueFrom(
        this.httpService
          .get(url, { headers: headersRequest })
          .pipe(map((res) => res.data)),
      );
      if (data['active?'] === false) {
        this.logger.log(`User ${user.intra_id} is leave of absence`);
        await this.lentService.returnCabinet(user);
      }
    } catch (err) {
      throw new HttpException(err.response.data, err.response.status);
      // TODO: http status code가 404(Not found)면, 유저 정보를 지우는 로직 추가
      // TODO: http status code가 401(Unauthorized)면, token을 refresh하는 로직 추가
      // TODO: http status code가 429 (Too Many Requests)면, 해결 방법 어떻게 할까요?
    }
  }
}
