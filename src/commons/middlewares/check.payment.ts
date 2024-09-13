import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VerifyPaymentMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
     return next()
    }

    try {
      // Verificar e decodificar o token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // Obter o ID do usuário (sub) do token
      const userId = payload.sub;
      // Verificar o pagamento mais recente do usuário
      const recentPayment = await this.prisma.payment.findFirst({
        where: {
          userId,
          status: 'COMPLETED',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (recentPayment) {
        return res.status(403).send('Not allowed. Payment required.');
      }

      next();
    } catch (error) {
      return res.status(401).send('Invalid or expired token.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
