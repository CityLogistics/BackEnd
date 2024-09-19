import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailConsumer } from './processors/email.processor';
// import { join } from 'path';
import { EmailController } from './email.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      //   processors: [join(__dirname, 'processors/email.processor.ts')],
    }),
  ],
  providers: [EmailService, EmailConsumer],
  exports: [BullModule],
  controllers: [EmailController],
})
export class EmailModule {}
