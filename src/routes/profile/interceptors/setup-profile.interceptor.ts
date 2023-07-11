import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common'
import { Observable } from 'rxjs'
import { isEmpty } from 'lodash'
import { SetupProfileError } from '@apptypes/profile.type'

@Injectable()
export class SetupProfileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { username } = data
        const error: SetupProfileError = {}
        
        const usernameRegex = /^.{6,20}$/
        if (!username.match(usernameRegex)) {
            error.usernameError = 'Username must be between 6 and 20 characters.'
        }

        if (!isEmpty(error)) {
            throw new HttpException({statusCode: 400, error }, HttpStatus.BAD_REQUEST)
        }

        return next.handle()
    }
}