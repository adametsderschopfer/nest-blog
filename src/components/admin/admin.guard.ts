import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { readFile } from 'fs';
import { promisify } from 'util';
import { join } from 'path';

const _readFile = promisify(readFile);

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { isAdmin, token: tokenFromUser } = context.getArgs()[0].cookies;

    const isValid = (async () => {
      if (!isAdmin) {
        return false;
      }

      const { token } = JSON.parse(
        await _readFile(join(__dirname, 'admin.json'), 'utf-8'),
      );

      return token === tokenFromUser;
    })();

    return isValid;
  }
}
