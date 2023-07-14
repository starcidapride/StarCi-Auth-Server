import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, NotFoundException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { isEmpty } from 'lodash'
import { SignUpErrors} from '@apptypes/auth.type'
import { cardMap } from '@utils/map'

@Injectable()
export class AlterCardInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { cardName } = data
        const errors: SignUpErrors = {}
        
        if (!cardMap[cardName]){
            throw new NotFoundException('This card name is not existed.')
        }

        if (!isEmpty(errors)) {
            throw new BadRequestException(errors)
        }

        return next.handle()
    }
}