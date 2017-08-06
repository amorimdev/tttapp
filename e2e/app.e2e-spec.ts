import { TttappPage } from './app.po';

describe('tttapp App', () => {
  let page: TttappPage;

  beforeEach(() => {
    page = new TttappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
