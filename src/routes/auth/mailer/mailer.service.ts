import jwtConfig from '@config/jwt.config'
import mailerConfig from '@config/mailer.config'
import serverConfig from '@config/server.config'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createTransport } from 'nodemailer'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { EmailType } from '@apptypes/auth.type'

dayjs.extend(duration)

@Injectable()
export class MailerService {
    constructor(private readonly jwtService: JwtService) {}

    private convertDuration(durationString: string): { day: number, hour: number, minute: number } {
        const durationTime = dayjs.duration(durationString)
        console.log(durationTime)
        const days = Math.floor(durationTime.asDays())
        const hours = Math.floor(durationTime.asHours()) % 24
        const minutes = Math.floor(durationTime.asMinutes()) % 60
        console.log ({ day: days, hour: hours, minute: minutes }, durationString )
        return { day: days, hour: hours, minute: minutes }
    }

    private getDurationMessage(durationString: string): string {
        const { day, hour, minute } = this.convertDuration(durationString)
        let message = ''

        if (day > 0) {
            message += `${day} day(s), `
        }

        if (hour > 0) {
            message += `${hour} hour(s), `
        }

        message += `${minute} minute(s)`

        return message
    }

    private generateToken(email: string, emailType: EmailType): string {
        const payload = { email }

        let expiresIn: string
        if (emailType == 'verify'){
            expiresIn = jwtConfig().verifyTokenExpiryTime
        } else {
            expiresIn = jwtConfig().resetPasswordTokenExpiryTime
        }

        return this.jwtService.sign(payload, {
            expiresIn: expiresIn,
            secret: jwtConfig().secret,
        })
    }

    private transporter = createTransport({
        service: 'gmail',
        auth: {
            user: mailerConfig().mailerUser,
            pass: mailerConfig().mailerPass,
        },
    })

    private registerMailOptions = (email: string) => {
        const serverURL = serverConfig().serverUrl
        const token = this.generateToken(email, 'verify')
        return {
            from: 'starcidapride@gmail.com',
            to: email,
            subject: 'REGISTRATION CONFIRMATION - STARCI',
            html: `
			<p>Dear ${email},</p>
			<p>To complete your registration, please click on the confirmation link below:</p>
			<a href="${serverURL}/auth/verify?email=${email}&token=${token}">Here</a>
            <p>This link will expire at ${this.getDurationMessage(jwtConfig().verifyTokenExpiryTime)}. After that, you will need to request a new confirmation email.</p>
			<p>If you did not sign up for StarCi, you can ignore this email.</p>
			<p>Best regards,</p>
			<p>Tu Cuong</p>
			<p>Founder of StarCi</p>`
        }
    }

    private forgetPasswordMailOptions = (email: string) => {
        const serverURL = serverConfig().serverUrl
        const token = this.generateToken(email, 'forgetPassword')
        return {
            from: 'starcidapride@gmail.com',
            to: email,
            subject: 'PASSWORD RESET - STARCI',
            html: `
                <p>Dear ${email},</p>
                <p>To reset your password, please click on the password reset link below:</p>
                <a href="${serverURL}/auth/show-reset-password-ui?email=${email}&token=${token}">Here</a>
                <p>This link will expire at ${this.getDurationMessage(jwtConfig().resetPasswordTokenExpiryTime)}. After that, you will need to request a new confirmation email.</p>
                <p>If you did not request a password reset for your StarCi account, you can ignore this email.</p>
                <p>Best regards,</p>
                <p>Tu Cuong</p>
                <p>Founder of StarCi</p>`
        }
    }

    async sendMail(email: string, emailType: EmailType) {
        let mailOptions 
        if (emailType == 'verify'){
            mailOptions = this.registerMailOptions(email)   
        } else if (emailType == 'forgetPassword'){
            mailOptions = this.forgetPasswordMailOptions(email)
        }

        this.transporter.sendMail(mailOptions)
    }
}