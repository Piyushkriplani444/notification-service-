import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotimeModule } from './notime/notime.module';

@Module({
  imports: [NotimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
