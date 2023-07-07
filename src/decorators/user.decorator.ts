import { createParamDecorator, ExecutionContext } from '@nestjs/common'
export const UserDecorator = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user
    }
)