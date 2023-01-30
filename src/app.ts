import express, { Application } from 'express'
import { connect, ConnectOptions } from 'mongoose'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import Controller from '@/utils/interfaces/Controller.interface'
import ErrorMiddleware from '@/middleware/error.middleware'
import HttpException from './utils/exceptions/httpExceptions'

class App {
  public port: number
  public app: Application

  constructor (controllers: Controller[], port: number) {
    this.port = port
    this.app = express()
    this.initializeMiddleware()
    this.initializeControllers(controllers)
    this.initializeDB()
    this.initializeErrorHandler()
  }

  private initializeMiddleware () {
    this.app.use(cors())
    this.app.use(compression())
    this.app.use(morgan('dev'))
    this.app.use(helmet())
    this.app.use(cookieParser())
    this.app.use(bodyParser.json())

    this.app.use(bodyParser.urlencoded({ extended: true }))
  }

  private initializeControllers (controllers: Controller[]) {
    controllers.map((controller: Controller) => {
      this.app.use(`/api`, controller.router)
    })
    this.app.all('*', (req, res, next) => {
      next(new HttpException(`Can't find ${req.originalUrl} on this server!`, 404));
    });
  }

  private initializeErrorHandler () {
    this.app.use(ErrorMiddleware)
  }

  private initializeDB () {
    type ConnectionOptionsExtend = {
      useNewUrlParser: boolean
      useUnifiedTopology: boolean
    }
    const connectionOptions:ConnectOptions & ConnectionOptionsExtend = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    let url = `${process.env.DATABASE_URL}`
    if(process.env.NODE_ENV == 'production') {
      url = `${process.env.DATABASE}`
    }
    connect(url, connectionOptions).then(() => {
      console.log('Database Connected Successfully')
    })
  }

  public listen () {
    this.app.listen(this.port, () => {
      console.log(`Application running on port ${this.port}`)
    })
  }
}

export default App
