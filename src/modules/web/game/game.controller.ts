import { Controller } from '@nestjs/common';
import { GameService } from './game.service';
import { WebRouter } from '../../../decorator/router.decorator';

@WebRouter('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
}
