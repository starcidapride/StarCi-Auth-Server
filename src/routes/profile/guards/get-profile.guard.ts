import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class GetProfileGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const params = request.params

        if (!params || Object.keys(params).length === 0 || Object.keys(params).length > 1) {
            return false
        }

        return true
    }
}