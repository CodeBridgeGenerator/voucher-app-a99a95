const { authenticate } = require("@feathersjs/authentication").hooks;
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
const { discard } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [
      async (context) => {
        // Allow unauthenticated find if only checking for email existence
        if (
          context.params.query &&
          context.params.query.email &&
          Object.keys(context.params.query).every(
            (key) => ["email", "$limit", "$select"].includes(key)
          )
        ) {
          return context;
        }
        // Otherwise, require authentication
        return authenticate("jwt")(context);
      },
    ],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [authenticate("jwt"), hashPassword("password")],
    patch: [authenticate("jwt"), hashPassword("password")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [protect("password"), discard("__v")],
    find: [
      (context) => {
        // Only return _id and email if unauthenticated and only checking email
        if (
          context.params.query &&
          context.params.query.email &&
          !context.params.user
        ) {
          context.result.data = context.result.data.map((user) => ({
            _id: user._id,
            email: user.email,
          }));
        }
        return context;
      },
    ],
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
