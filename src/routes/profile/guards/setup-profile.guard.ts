import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SignUpRequest } from '@apptypes/auth.type'
import { SetupProfileRequest } from '@apptypes/profile.type'

@Injectable()
export class SetupProfileGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body : unknown | SignUpRequest = request.body

        if (this.isSetupProfileRequest(body)) {
            return true
        }
		
        return false
    }

    private isSetupProfileRequest(body: unknown): body is SetupProfileRequest {
        const castedBody = body as SetupProfileRequest
        return (
            castedBody.username !== undefined &&
			castedBody.picture !== undefined &&
			castedBody.bio !== undefined
        )
    }
}