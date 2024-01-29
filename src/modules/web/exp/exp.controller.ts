import { Controller } from '@nestjs/common';
import { ExpService } from './exp.service';

@Controller('exp')
export class ExpController {
  constructor(private readonly expService: ExpService) {}
}
