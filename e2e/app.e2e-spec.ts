import { RhizomaticaSipAppPage } from './app.po';

describe('rhizomatica-sip-app App', () => {
  let page: RizomaticaSipAppPage;

  beforeEach(() => {
    page = new RizomaticaSipAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
