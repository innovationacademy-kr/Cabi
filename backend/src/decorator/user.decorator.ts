import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * req의 user 필드에서 값을 가져오는 커스텀 데코레이터
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
