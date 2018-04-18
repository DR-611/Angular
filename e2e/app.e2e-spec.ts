import { ConFusionPage } from './app.po';

describe('con-fusion App', () => {
  let page: ConFusionPage;

  beforeEach(() => {
    page = new ConFusionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
