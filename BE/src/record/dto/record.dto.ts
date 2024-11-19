import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

enum Domains {
  NAME = 'name',
  COUNTRY = 'country',
  CITY = 'city',
  EMAIL = 'email',
  PHONE = 'phone',
  SEX = 'sex',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ENUM = 'enum'
}

export class RandomRecordInsertDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnInfo)
  columns: ColumnInfo[];

  @IsInt()
  @Min(1)
  @Max(10000)
  count: number;
}

class ColumnInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Domains)
  type: Domains;

  @IsInt()
  @Min(0)
  @Max(100)
  blank: number;

  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;

  @ValidateIf((obj) => obj.enum !== undefined)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  enum?: string[];
}
