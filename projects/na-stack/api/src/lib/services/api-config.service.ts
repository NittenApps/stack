import { InjectionToken } from '@angular/core';
import { ApiConfig } from '../types/api-config';

export const NAS_API_CONFIG = new InjectionToken<ApiConfig>('ApiConfig');
