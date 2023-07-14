import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SignUpRequest } from '@apptypes/auth.type'
import { AlterCardsRequest } from '@apptypes/deck.type'

@Injectable()
export class AlterCardsGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body: unknown | SignUpRequest = request.body

        if (this.isAlterCardsRequest(body)) {
            return true
        }

        return false
    }

    private isAlterCardsRequest(body: unknown): body is AlterCardsRequest {
        const castedBody = body as AlterCardsRequest
        return (
            castedBody.deckName !== undefined &&
            castedBody.cardNames !== undefined &&
            Array.isArray(castedBody.cardNames) &&
            castedBody.cardNames.every((cardName) => typeof cardName === 'string')
        )
    }
}