import { Page, Locator } from '@playwright/test';

export class HeaderNavigationPage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly conferencesLink: Locator;
  readonly articlesLink: Locator;
  readonly blogLink: Locator;
  readonly contactLink: Locator;
  readonly socialBar: Locator;
  readonly twitterLink: Locator;
  readonly linkedinLink: Locator;
  readonly youtubeLink: Locator;
  readonly logInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navigation = page.getByRole('navigation', { name: 'Site' });
    this.homeLink = this.navigation.getByRole('link', { name: 'Home', exact: true });
    this.aboutLink = this.navigation.getByRole('link', { name: 'About', exact: true });
    this.conferencesLink = this.navigation.getByRole('link', { name: 'Conferences', exact: true });
    this.articlesLink = this.navigation.getByRole('link', { name: 'Articles', exact: true });
    this.blogLink = this.navigation.getByRole('link', { name: 'Blog', exact: true });
    this.contactLink = this.navigation.getByRole('link', { name: 'Contact', exact: true });

    this.socialBar = page.getByRole('list', { name: 'Social Bar' });
    this.twitterLink = this.socialBar.getByRole('link', { name: 'Twitter' });
    this.linkedinLink = this.socialBar.getByRole('link', { name: 'LinkedIn' });
    this.youtubeLink = this.socialBar.getByRole('link', { name: 'YouTube' });

    this.logInButton = page.getByRole('button', { name: 'Log In', exact: true });
  }
}
