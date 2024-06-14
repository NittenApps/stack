export enum MessageLevel {
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  OK = 'OK',
  TOO_BUSY = 'TOO_BUSY',
}

export type ApiMessage = {
  level: MessageLevel;
  code: string;
  message: string;
};
