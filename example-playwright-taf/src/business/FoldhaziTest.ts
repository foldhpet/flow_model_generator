import { BaseTest } from '../core/BaseTest';

export abstract class FoldhaziTest extends BaseTest {
  async beforeEach(): Promise<void> {
    await super.beforeEach();
    await this.Page.goto('https://www.peterfoldhazi.com');
  }
}