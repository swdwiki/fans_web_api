import { Req, Post, Body } from '@nestjs/common';
import { ReportService } from './report.service';
import { createReportFormDto } from './dto_vo/reportDto.dto';
import { WebRouter } from '../../../decorator/router.decorator';

@WebRouter('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('send')
  createReports(@Body() createReportForm: createReportFormDto, @Req() req) {
    const { userId } = req.user;
    return this.reportService.createCommentReport(createReportForm, userId);
  }
}
