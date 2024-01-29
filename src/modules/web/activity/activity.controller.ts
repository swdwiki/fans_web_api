import { Controller } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { WebRouter } from '../../../decorator/router.decorator';

@WebRouter('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
}
