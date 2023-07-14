import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SignUpRequest } from '@apptypes/auth.type'
import { AlterCardRequest }  from '@apptypes/deck.type'

@Injectable()
export class AlterCardGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body : unknown | SignUpRequest = request.body

        if (this.isAddCardRequest(body)) {
            return true
        }
		
        return false
    }

    private isAddCardRequest(body: unknown): body is AlterCardRequest {
        const castedBody = body as AlterCardRequest
        return (
            castedBody.deckName !== undefined &&
			castedBody.cardName !== undefined
        )
    }
}