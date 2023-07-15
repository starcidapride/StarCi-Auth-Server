import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, NotFoundException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { isEmpty } from 'lodash'
import { SignUpErrors} from '@apptypes/auth.type'
import { cardMap } from '@utils/map'

@Injectable()
export class AlterCardsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { cardNames } = data
        const errors: SignUpErrors = {}
        
       

        for (const cardName of cardNames){
            if (!cardMap[cardName]){
                throw new NotFoundException(`Card ${cardName} is not available.`)
            }
        }
        
        if (!isEmpty(errors)) {
            throw new BadRequestException(errors)
        }

        return next.handle()
    }
}