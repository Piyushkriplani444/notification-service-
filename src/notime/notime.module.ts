import { Module } from '@nestjs/common';
import { NotimeController } from './notime.controller';
import { NotimeService } from './notime.service';

@Module({
  controllers: [NotimeController],
  providers: [NotimeService],
})
export class NotimeModule {}
