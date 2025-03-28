import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    console.log('No header ' + authHeader);
    res.status(401).send();
    return;
  }

  const token: string | undefined = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).send();
    return;
  }

  const secret = process.env.JWTSECRET || 'not very secret';

  try {
    const payload = jwtVerify(token, secret);
    res.locals.payload = payload;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(403).send();
    return;
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.payload; // The decoded JWT payload
    if (user && user.role === 'admin') {
      return next(); // Proceed to the next handler
    } else {
      res.status(403).json({ error: 'Admin access required.' });
    }
  };

