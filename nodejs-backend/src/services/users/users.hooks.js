const { authenticate } = require("@feathersjs/authentication").hooks;
const { hashPassword, protect } = require("@feathersjs/authentication-local").hooks;
const { discard } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [
      hashPassword("password"),
      async (context) => {
        // Force default role as 'user' unless explicitly set by admin
        if (!context.data.role) {
          context.data.role = "user";
        }
        return context;
      },
    ],
    update: [authenticate("jwt"), hashPassword("password")],
    patch: [authenticate("jwt"), hashPassword("password")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Remove password field from all responses
      protect("password"),
      discard("__v"), // Clean response if you have Mongoose __v version key
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
