import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRandomRecordDto } from './dto/create-random-record.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../common/response/response.dto';
import { ResRecordDto } from './dto/res-record.dto';
import { ExecuteRecordSwagger } from '../config/swagger/record-swagger.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDBConnectionInterceptor } from '../interceptors/user-db-connection.interceptor';
import { Request } from 'express';

@ApiExtraModels(ResponseDto, ResRecordDto)
@ApiTags('랜덤 데이터 생성 API')
@Controller('api/record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @UseInterceptors(UserDBConnectionInterceptor)
  @ExecuteRecordSwagger()
  @Serialize(ResRecordDto)
  @Post()
  async insertRandomRecord(
    @Req() req: Request,
    @Body() randomRecordInsertDto: CreateRandomRecordDto,
  ) {
    await this.recordService.validateDto(randomRecordInsertDto, req.sessionID);
    return this.recordService.insertRandomRecord(req, randomRecordInsertDto);
  }
}
