import { ListQueryDto } from '../../../../modules/default.dto';

export class creatorListQueryDto extends ListQueryDto {
  userId: number;
  type: string;
  likeType?: string;
}
