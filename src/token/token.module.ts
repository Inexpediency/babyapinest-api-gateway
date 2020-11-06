import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token.service';
import { TokenSchema } from './schemas/user-token.schema';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }])
  ],
})
export class TokenModule {}
