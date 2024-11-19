import { Provider } from '@angular/core';
import { ErrorDialog } from './error/error.dialog';
import { ConfirmDialog } from './confirm/confirm.dialog';
import { InfoDialog } from './info/info.dialog';

export { ConfirmDialog, ErrorDialog, InfoDialog };

export const COMMON_DIALOGS: Provider[] = [ConfirmDialog, ErrorDialog, InfoDialog];
