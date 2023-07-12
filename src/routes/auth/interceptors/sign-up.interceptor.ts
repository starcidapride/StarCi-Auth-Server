import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { isEmpty } from 'lodash'
import { SignUpErrors} from '@apptypes/auth.type'

@Injectable()
export class SignUpInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {

        const data = context.switchToHttp().getRequest().body
        const { email, password, confirm, firstName, lastName } = data
        const errors: SignUpErrors = {}
        
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!email.match(emailRegex)) {
            errors.emailError = 'Invalid email format (abc@xyz.gh).'
        }

        const passwordLengthRegex = /^.{6,20}$/
        const passwordSpecialCharRegex = /^(?=.*?[A-Z])(?=.*?[!@#$%^&*()_+~`|}{\\[\]\\:;“’<,>.?/]).*$/

        if (!(password.match(passwordLengthRegex) || password.match(passwordSpecialCharRegex))) {
            errors.passwordError = 'Password must be between 6 and 20 characters and contain at least one uppercase letter and one special character.'
        }

        else if (!password.match(passwordLengthRegex)) {
            errors.passwordError = 'Password must be between 6 and 20 characters.'
        }

        else if (!password.match(passwordSpecialCharRegex)) {
            errors.passwordError = 'Password must contain at least one uppercase letter and one special character.'
        }

        else if (confirm != password) {
            errors.confirmError = 'Password and confirmation do not match.'
        }

        const nameRegex = /^.{2,50}$/
        if (!firstName.match(nameRegex)) {
            errors.firstNameError = 'First name must be between 2 and 50 characters.'
        }

        if (!lastName.match(nameRegex)) {
            errors.lastNameError = 'Last name must be between 2 and 50 characters.'
        }

        if (!isEmpty(errors)) {
            throw new BadRequestException(errors)
        }

        return next.handle()
    }
}