import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SignUpRequest } from '@apptypes/auth.type'
import { Deck } from '@apptypes/deck.type'

@Injectable()
export class AddDeckGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body : unknown | SignUpRequest = request.body

        if (this.isAddDeckRequest(body)) {
            return true
        }
		
        return false
    }

    private isAddDeckRequest(body: unknown): body is Deck {
        const castedBody = body as Deck
        return (
            castedBody.deckName !== undefined &&
			castedBody.playDeck !== undefined &&
			castedBody.characterDeck !== undefined
        )
    }
}