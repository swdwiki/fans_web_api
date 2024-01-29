import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreatePostColumnDto, UpdatePostColumnDto } from './dto/column.dto';
import { WebRouter } from '../../../../decorator/router.decorator';
import { ListQueryDto } from '../../../../modules/default.dto';
import { Public } from '../../../../decorator/default.decorator';

@WebRouter('post/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('add')
  create(@Body() createColumnDto: CreatePostColumnDto, @Req() req) {
    return this.columnsService.create(createColumnDto, req.user);
  }

  @Get('list')
  findList(@Req() req, @Query() listQueryDto: ListQueryDto) {
    return this.columnsService.findList(listQueryDto, req.user);
  }

  @Get('list/all')
  findAll(@Req() req) {
    return this.columnsService.findAll(req.user);
  }

  @Public()
  @Get(':id')
  findOneByPublic(@Param('id') id: string) {
    return this.columnsService.findOneByPublic(+id);
  }

  @Get('creator/:id')
  findOneByCreator(@Param('id') id: string, @Req() req) {
    return this.columnsService.findOneByUser(+id, req);
  }

  @Post('update')
  update(@Body() updateColumnDto: UpdatePostColumnDto, @Req() req) {
    return this.columnsService.update(updateColumnDto, req.user);
  }

  @Delete('remove/:columnId')
  remove(@Param('columnId') columnId: string, @Req() req) {
    return this.columnsService.remove(+columnId, req.user);
  }
}
