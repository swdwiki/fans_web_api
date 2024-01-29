import { HttpException, Injectable } from '@nestjs/common';
import { createReportFormDto } from './dto_vo/reportDto.dto';
import { Reports } from '../../../models/index.model';

@Injectable()
export class ReportService {
  async createCommentReport(reportForm: createReportFormDto, userId: number) {
    const { reasonId, type, content, imgFilesUrl, ...formIds } = reportForm;
    const reportCount = await Reports.count({
      where: {
        ...formIds,
        userId,
      },
    });
    if (reportCount >= 1) {
      throw new HttpException(
        '你已投诉过该内容，无需再次投诉，请耐心等待管理员处理',
        403,
      );
    }
    const createRes = await Reports.create({
      reasonId,
      type,
      content,
      imgFilesUrl,
      ...formIds,
      userId,
    });

    return createRes;
  }
}
