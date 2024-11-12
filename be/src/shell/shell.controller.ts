import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ShellService } from './shell.service';
import { ExceptionHandler } from '../common/exception/exception.handler';
import { UpdateShellDto } from './dto/update-shell.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResShellDto } from './dto/res-shell.dto';

@Controller('api/shells')
@UseFilters(new ExceptionHandler())
export class ShellController {
  constructor(private shellService: ShellService) {}

  @Post()
  @Serialize(ResShellDto)
  async create() {
    return await this.shellService.create();
  }

  @Put(':shellId')
  @Serialize(ResShellDto)
  async update(
    @Param('shellId') shellId: number,
    @Body() updateShellDto: UpdateShellDto,
  ) {
    return await this.shellService.update(shellId, updateShellDto);
  }

  @Delete(':shellId')
  async delete(@Param('shellId') shellId: number) {
    await this.shellService.delete(shellId);
  }
}
