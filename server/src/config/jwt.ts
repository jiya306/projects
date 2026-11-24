import jwt from 'jsonwebtoken';
import { ENV } from './env';
import { AuthUserPayload } from '../types';

export const generateToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): AuthUserPayload | null => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
  } catch (error) {
    return null;
  }
};
