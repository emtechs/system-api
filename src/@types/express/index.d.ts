import * as express from 'express';
import { IDash, IRole } from '../../interfaces';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: IRole;
      };
    }
  }
}
