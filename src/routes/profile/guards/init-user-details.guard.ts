import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SignUpRequest } from '@apptypes/auth.type'
import { InitUserDetailsRequest } from '@apptypes/profile.type'

@Injectable()
export class InitUserDetailsGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body : unknown | SignUpRequest = request.body

        if (this.isInitProfileDetailsRequest(body)) {
            return true
        }
		
        return false
    }

    private isInitProfileDetailsRequest(body: unknown): body is InitUserDetailsRequest {
        const castedBody = body as InitUserDetailsRequest
        return (
            castedBody.username !== undefined &&
			castedBody.picture !== undefined &&
			castedBody.bio !== undefined
        )
    }
}