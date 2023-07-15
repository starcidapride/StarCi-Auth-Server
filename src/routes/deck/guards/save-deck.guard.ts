import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SaveDeckRequest } from '@apptypes/deck.type'

@Injectable()
export class SaveDeckGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body: unknown | SaveDeckRequest = request.body

        if (this.isSaveDeckRequest(body)) {
            return true
        }

        return false
    }

    private isSaveDeckRequest(body: unknown): body is SaveDeckRequest {
        const castedBody = body as SaveDeckRequest
        return (
            castedBody.deckName !== undefined &&
            castedBody.playCardNames !== undefined &&
            Array.isArray(castedBody.playCardNames) &&
            castedBody.playCardNames.every((cardName) => typeof cardName === 'string')
            &&
            castedBody.characterCardNames !== undefined &&
            Array.isArray(castedBody.characterCardNames) &&
            castedBody.characterCardNames.every((cardName) => typeof cardName === 'string') 
        )
    }
}