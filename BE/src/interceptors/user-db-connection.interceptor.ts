import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { createReadStream } from 'fs';
import {
  ConnectionLimitExceedException,
  DataLimitExceedException,
} from '../common/exception/custom-exception';

@Injectable()
export class UserDBConnectionInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const identify = request.sessionID;

    try {
      request.dbConnection = await createConnection({
        host: this.configService.get<string>('QUERY_DB_HOST'),
        user: identify.substring(0, 10),
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify.substring(0, 10),
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      });
    } catch (err) {
      if (err.errno == 1040) {
        throw new ConnectionLimitExceedException();
      }
      throw err;
    }

    await request.dbConnection.query('set profiling = 1');
    await request.dbConnection.beginTransaction();

    return next.handle().pipe(
      tap(async () => {
        await request.dbConnection.commit();
      }),
      catchError(async (err) => {
        if (err instanceof DataLimitExceedException)
          await request.dbConnection.rollback();
        throw err;
      }),
      finalize(async () => await request.dbConnection.end()),
    );
  }
}
