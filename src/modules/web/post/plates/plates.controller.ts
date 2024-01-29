import { Controller, Get } from '@nestjs/common';
import { WebPlatesService } from './plates.service';

@Controller('web/post/plates')
export class WebPlatesController {
  constructor(private readonly platesService: WebPlatesService) {}

  @Get('list')
  getPostPlatesList(query): any {
    return this.platesService.list();
  }
}
