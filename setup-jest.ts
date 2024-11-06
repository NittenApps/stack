(globalThis as any).ngJest = {
  testEnvironmentOptions: {
    teardown: {
      destroyAfterEach: false,
      rethrowErrors: true,
    },
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

import 'jest-preset-angular/setup-jest';
import 'jest-extended';
