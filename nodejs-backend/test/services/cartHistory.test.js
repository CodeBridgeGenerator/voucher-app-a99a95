const assert = require('assert');
const app = require('../../src/app');

describe('\'cartHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('cartHistory');

    assert.ok(service, 'Registered the service (cartHistory)');
  });
});
