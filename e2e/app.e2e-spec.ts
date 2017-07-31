import { SaycelSipAppPage } from './app.po';

describe('saycel-sip-app App', () => {
  let page: SaycelSipAppPage;

  beforeEach(() => {
    page = new SaycelSipAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
