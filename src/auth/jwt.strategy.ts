import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // Must match the secret in AuthModule
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT.
    // We can add more user validation here if needed, e.g., check if the user still exists.
    return { userId: payload.sub, username: payload.username };
  }
} 