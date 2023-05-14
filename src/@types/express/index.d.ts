import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: 'SERV' | 'DIRET' | 'SECRET' | 'ADMIN';
      };
    }
  }
}
