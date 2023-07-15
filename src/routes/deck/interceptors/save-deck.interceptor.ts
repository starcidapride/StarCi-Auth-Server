import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { cardMap } from '@utils/card-map'

@Injectable()
export class SaveDeckInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { playCardNames, characterCardNames } = data
           
        const componentDeckTypes = ['play', 'character']
        
        componentDeckTypes.forEach(componentDeckType => {
            const cardNames = componentDeckType === 'play' ? playCardNames : characterCardNames
            for (const cardName of cardNames) {
                if (!cardMap[cardName]) {
                    throw new NotFoundException(`Card ${cardName} is not available.`)
                }
            }
        })

        return next.handle()
    }
}