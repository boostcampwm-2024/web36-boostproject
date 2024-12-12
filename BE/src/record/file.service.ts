import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import fs from 'fs/promises';
import {
  RANDOM_DATA_TEMP_DIR,
  RECORD_PROCESS_BATCH_SIZE,
} from './constant/random-record.constant';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { RandomColumnModel } from './random-column.entity';
import * as path from 'node:path';
import { ResultSetHeader } from 'mysql2/promise';
import * as crypto from 'node:crypto';
import pLimit from 'p-limit';
import { ConnectionLimitExceedException } from '../common/exception/custom-exception';

@Injectable()
export class FileService implements OnModuleInit {
  constructor(private readonly userDBManager: UserDBManager) {}

  async onModuleInit() {
    try {
      await fs.access(RANDOM_DATA_TEMP_DIR);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(RANDOM_DATA_TEMP_DIR, { recursive: true });
      } else {
        console.error('csv 폴더 접근 오류: ', err);
      }
    }
  }

  async generateCsvFile(
    columnEntities: RandomColumnModel[],
    rows: number,
  ): Promise<string[]> {
    const randomString = crypto.randomBytes(10).toString('hex');
    const filePaths: string[] = [];
    let remainRows = rows;
    let batchIndex = 0;

    while (remainRows > 0) {
      const currentBatchSize = Math.min(remainRows, RECORD_PROCESS_BATCH_SIZE);
      const data = this.generateCsvData(columnEntities, currentBatchSize);
      const filePath = path.join(
        RANDOM_DATA_TEMP_DIR,
        `${randomString}_${batchIndex}.csv`,
      );
      try {
        await fs.writeFile(filePath, data);
      } catch (err) {
        console.error('CSV 파일 쓰기 실패:', err);
        throw new InternalServerErrorException({
          message: 'CSV 파일 쓰기 실패: ' + err.message,
          error: err.message,
        });
      }
      filePaths.push(filePath);
      remainRows -= currentBatchSize;
      batchIndex++;
    }
    return filePaths;
  }

  async loadCSVFilesToDB(
    req: any,
    csvFilePaths: string[],
    tableName: string,
    columnNames: string[],
  ): Promise<number> {
    const limit = pLimit(2);

    const loadTasks = csvFilePaths.map((csvFilePath) =>
      limit(async () => {
        const query = `
        LOAD DATA LOCAL INFILE \'${csvFilePath.replace(/\\/g, '\\\\')}\'
        INTO TABLE ${tableName}
        FIELDS TERMINATED BY ','
        LINES TERMINATED BY '\\n'
        (${columnNames.map((col) => `\`${col}\``).join(',')});`;
        try {
          const queryResult = (await this.userDBManager.runWithNewConnection(
            req,
            query,
          )) as ResultSetHeader;
          return queryResult.affectedRows;
        } catch (err) {
          if (err.errno == 1040) {
            throw new ConnectionLimitExceedException();
          } else {
            console.error(`CSV 파일 ${csvFilePath} 삽입 중 에러:`, err);
            throw new InternalServerErrorException({
              message: `랜덤 데이터 DB 삽입 중 에러: ${err.message}`,
              error: err.message,
            });
          }
        }
      }),
    );

    const results = await Promise.all(loadTasks);

    return results.reduce((sum, rows) => sum + rows, 0);
  }

  async deleteFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'CSV 파일 삭제 실패: ' + err.message,
        error: err.message,
      });
    }
  }
  private generateCsvData(
    columnEntities: RandomColumnModel[],
    rows: number,
  ): string {
    let data = columnEntities.map((column) =>
      column.generator.getRandomValues(rows, column.blank),
    );
    data = this.transpose(data);
    return data.map((row) => row.join(',')).join('\n') + '\n';
  }

  private transpose(matrix) {
    return matrix.reduce(
      (acc, row) => row.map((_, i) => [...(acc[i] || []), row[i]]),
      [],
    );
  }
}
