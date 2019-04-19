import { ClientFunction } from 'testcafe';

const getPageTitle = ClientFunction(() => document.title);

const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Home Page`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('e2e', async t => {
  await t.expect(getPageTitle()).eql('The Looking-Glass');
});

test('should open window', async t => {
  await t.expect(getPageTitle()).eql('The Looking-Glass');
});

test(
  "should haven't any logs in console of main window",
  assertNoConsoleErrors
);
