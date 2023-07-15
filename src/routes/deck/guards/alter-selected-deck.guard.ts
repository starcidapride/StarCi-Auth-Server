import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AlterSelectedDeckRequest} from '@apptypes/deck.type'

@Injectable()
export class AlterSelectedDeckGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body: unknown | AlterSelectedDeckRequest = request.body

        if (this.isAlterSelectedDeckRequest(body)) {
            return true
        }

        return false
    }

    private isAlterSelectedDeckRequest(body: unknown): body is AlterSelectedDeckRequest {
        const castedBody = body as AlterSelectedDeckRequest
        return (
            castedBody.selectedDeckIndex !== undefined &&
          typeof castedBody.selectedDeckIndex === 'number'
        )
    }
}