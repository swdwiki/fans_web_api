import { Module } from '@nestjs/common';
import { SigninService } from './signin.service';
import { SigninController } from './signin.controller';
import { WebExpModule } from '../../exp/exp.module';

@Module({
  controllers: [SigninController],
  providers: [SigninService],
  imports: [WebExpModule],
})
export class WebSigninModule {}
