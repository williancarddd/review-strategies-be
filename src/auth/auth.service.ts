import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseSchema } from './dto/auth-dto';
import { comparePasswords } from 'src/utils/crypto';
import { UsersService } from 'src/users/users.service';
import { StripeService } from 'src/payments/payments.service';

/*
  The AuthService class is a service that provides methods to validate a user and login.
  The validateUser method receives an email and a password and calls the findByEmail method from the UsersService class to find a user by email.
  The comparePasswords function is called to compare the password received as a parameter with the password of the user found.
  If the user is found and the passwords match, the method returns the user object without the password property.
  If the user is not found or the passwords do not match, the method returns null.
  The login method receives a user object and generates a JWT token with the user email and id as payload.
*/

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService
  ) { }

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrUsername(login);
    if (!user) throw new NotFoundException('User Not found');
    const compare = comparePasswords(password, user!.password);
    if (user && compare) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user) {
    const subscription = await this.stripeService.checkIfUserHasActiveSubscription(user.id);
    const payload = { email: user.email, sub: user.id, role: user.role ,hasActiveSubscription: subscription.hasActiveSubscription };
    const response = {
      access_token: this.jwtService.sign(payload),
      ...payload
    };

    const responseParsed = AuthResponseSchema.parse(response);

    return responseParsed;
  }
}
