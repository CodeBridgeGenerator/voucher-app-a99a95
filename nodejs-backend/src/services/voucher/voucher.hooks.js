const { authenticate } = require('@feathersjs/authentication').hooks;
const restrictToRoles = require('./restrictToRoles'); // adjust path if needed


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [restrictToRoles(['admin'])],
    update: [restrictToRoles(['admin'])],
    patch: [restrictToRoles(['admin'])],
    remove: [restrictToRoles(['admin'])]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
