import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { AudioConsumer } from './processors/email.processor';
// import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      //   processors: [join(__dirname, 'processors/email.processor.ts')],
    }),
  ],
  providers: [EmailService, AudioConsumer],
  exports: [BullModule],
})
export class EmailModule {}
