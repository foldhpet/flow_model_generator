import { test as base, expect } from '../core/base-test';
import { devEnv } from '../config/environments/devEnv';

type FoldhaziTestFixtures = {
  foldhaziBaseURL: string;
};

export const test = base.extend<FoldhaziTestFixtures>({
  foldhaziBaseURL: devEnv.baseURL,
});

export { expect };