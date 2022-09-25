import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreapiModule } from './coreapi/coreapi.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreapiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
