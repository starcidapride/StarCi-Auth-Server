import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import {DefaultDeckRequest} from '@apptypes/deck.type'

@Injectable()
export class DefaultDeckGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body: unknown | DefaultDeckRequest = request.body

        if (this.isAlterSelectedDeckRequest(body)) {
            return true
        }

        return false
    }

    private isAlterSelectedDeckRequest(body: unknown): body is DefaultDeckRequest {
        const castedBody = body as DefaultDeckRequest
        return (
            castedBody.defaultDeckIndex !== undefined &&
          typeof castedBody.defaultDeckIndex === 'number'
        )
    }
}