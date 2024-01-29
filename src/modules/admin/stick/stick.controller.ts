import { Controller } from '@nestjs/common';
import { StickService } from './stick.service';

@Controller('stick')
export class StickController {
  constructor(private readonly stickService: StickService) {}
}
