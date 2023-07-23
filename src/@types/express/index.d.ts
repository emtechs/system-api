// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express'
import { IRequestUser } from '../../interfaces'

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser
    }
  }
}
