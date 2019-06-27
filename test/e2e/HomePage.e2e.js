import { ClientFunction, RequestMock } from 'testcafe';

// Mock http
var mock = RequestMock()
  .onRequestTo(new RegExp('http://localhost:3001*'))
  .respond([], 200, { 'access-control-allow-origin': '*' });

// Helper functions
const getPageTitle = ClientFunction(() => document.title);

const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

// Create fixture
fixture`Home Page`
  .page('../../app/app.html')
  .requestHooks(mock)
  .afterEach(assertNoConsoleErrors);

// Tests
test('e2e', async t => {
  await t.expect(getPageTitle()).eql('The Looking-Glass');
});

test('should open window', async t => {
  await t.expect(getPageTitle()).eql('The Looking-Glass');
});

test("should haven't any logs in console of main window", assertNoConsoleErrors);
