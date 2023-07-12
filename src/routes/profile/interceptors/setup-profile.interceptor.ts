import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class SetupProfileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { username } = data
        
        const usernameRegex = /^.{6,20}$/
        if (!username.match(usernameRegex)) {
            const error = {
                usernameError : 'Username must be between 6 and 20 characters.'
            }
            throw new BadRequestException(error)
        }
        return next.handle()
    }
}