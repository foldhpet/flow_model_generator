import { Page, expect } from '@playwright/test';
import { HeaderNavigationPage } from '../pages/header-navigation.page';

export class MenuNavigationFlow {
  readonly page: Page;
  readonly header: HeaderNavigationPage;

  constructor(page: Page, header: HeaderNavigationPage) {
    this.page = page;
    this.header = header;
  }

  async navigateToHome(): Promise<void> {
    await this.header.homeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToAbout(): Promise<void> {
    await this.header.aboutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToConferences(): Promise<void> {
    await this.header.conferencesLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToArticles(): Promise<void> {
    await this.header.articlesLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToBlog(): Promise<void> {
    await this.header.blogLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToContact(): Promise<void> {
    await this.header.contactLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Orchestrates Menu Flow step 1: click through every top menu bar entry and verify
   * each destination page opened correctly (page title matches its <title> tag).
   */
  async clickThroughAllMenuPages(): Promise<void> {
    await this.navigateToAbout();
    await this.verifyPageTitle('About | Péter Földházi Jr.');

    await this.navigateToConferences();
    await this.verifyPageTitle('Conferences | Péter Földházi Jr.');

    await this.navigateToArticles();
    await this.verifyPageTitle('Articles | Péter Földházi Jr.');

    await this.navigateToBlog();
    await this.verifyPageTitle('Blog | Péter Földházi Jr.');

    await this.navigateToContact();
    await this.verifyPageTitle('Contact | Péter Földházi Jr.');

    await this.navigateToHome();
    await this.verifyPageTitle('Péter Földházi Jr. - Test Automation');
  }

  /**
   * Orchestrates Menu Flow step 2: verify the social media bar links to the correct
   * Twitter, LinkedIn and YouTube profiles. The live site links to LinkedIn rather than
   * Facebook (see docs/FLOW-MODELS-DESIGN.md for the discrepancy with USER-FLOWS.md).
   */
  async verifySocialMediaHandlers(): Promise<void> {
    await expect(this.header.twitterLink).toHaveAttribute('href', 'https://twitter.com/FoldhaziJr');
    await expect(this.header.linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/peter-foldhazi-jr/'
    );
    await expect(this.header.youtubeLink).toHaveAttribute(
      'href',
      'https://www.youtube.com/channel/UC6vSWVgQY87Ax1qHU-stkYQ'
    );
  }
}
