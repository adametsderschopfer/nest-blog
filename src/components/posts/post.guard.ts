import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PostGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { author = undefined } = context.getArgs()[0].cookies;

    if (author === undefined) {
      return false;
    }

    return true;
  }
}
