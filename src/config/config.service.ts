import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  public AdminAuthData = {
    login: 'admin',
    password: 'admin',
  };
}
