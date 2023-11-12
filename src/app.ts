import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
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
import redisClient from '@/utils/cache/connection'
import * as redis from 'redis';
class App {
  public port: number
  public app: Application

  static redisClient:any;

  constructor (controllers: Controller[], port: number) {
    this.port = port
    this.app = express()
    this.initializeMiddleware()
    this.initializeControllers(controllers)
    
    this.initializeDB()
    this.initializeErrorHandler()
  }

  private initializeMiddleware () {
    redisClient(redis).then((res:any) => App.redisClient = res).catch((e) => console.log(e))
    // const corsOptions = {
    //   origin: '*', // Replace with the origin of your React app
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //   credentials: true, // Allow cookies and authorization headers
    // };
    
    const corsOptions = {
      origin: [
        "http://localhost:3000",
      ],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-public-key",
        "x-secret-key",
        "x-token",
      ],
    };

    this.app.use(cors<cors.CorsRequest>(corsOptions));
    this.app.use(compression())
    this.app.use(morgan('dev'))
    // this.app.use(helmet({crossOriginEmbedderPolicy: false}))
    this.app.use(cookieParser())
    this.app.use(express.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

  }

  private initializeControllers (controllers: Controller[]) {
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/profile`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/events`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/products`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/music/audios`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/music/images`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/uploads/images`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/uploads/videos`));
    this.app.use('/', express.static(`${path.join(__dirname)}/../public/hookups`));
    controllers.map((controller: Controller) => {
      this.app.use(`/api`, controller.router)
    })
    this.app.all('*', (req, res, next) => {
      res.send("<h1>Welcome to Coal City Connect</h1> <p>For more information <a href = 'mailto: connectcoalcity@gmail.com'>Contact</a> Support</p>")
      // next(new HttpException(`Can't find ${req.originalUrl} on this server!`, 404));
    });
  }

  private initializeErrorHandler () {
    this.app.use(ErrorMiddleware)
  }

  private credentials () {
  const privateKey  = fs.readFileSync('/etc/letsencrypt/live/{hostname}/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/{hostname}/cert.pem', 'utf8');

  return {key: privateKey, cert: certificate};
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
      console.log(`Database Connected Successfully on ${url}`)
    })
  }

  public listen () {
  // var httpServer = http.createServer(this.app);
  // var httpsServer = https.createServer(this.credentials(), this.app);
    this.app.listen(this.port, () => {
      console.log(`Application running on port ${this.port}`)
    })
    // httpServer.listen(this.port, () => {
    // console.log(`Application running on port ${this.port}`)
    // });
    // httpsServer.listen(3443);
  }
}

export default App
