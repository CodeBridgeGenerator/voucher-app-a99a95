module.exports = function restrictToRoles(allowedRoles = []) {
  return async (context) => {
    const { user } = context.params;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new Error('You are not authorized to perform this action');
    }

    return context;
  };
};
