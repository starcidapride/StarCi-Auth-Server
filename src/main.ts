import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import serverConfig from '@config/server.config'
import {json} from 'body-parser'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.enableCors()
    app.setBaseViewsDir(join(__dirname, '..', 'views'))
 	app.setViewEngine('ejs')

    const config = new DocumentBuilder()
        .setTitle('StarCi Auth Server')
        .setDescription('The StarCi Auth Server is responsible for handling user authentication and authorization for the StarCi application. It provides secure access control mechanisms, user registration, login, and token-based authentication')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('/', app, document)
    app.use(json({limit: '50mb'}))
    await app.listen(serverConfig().port || 3000)

}

bootstrap()
