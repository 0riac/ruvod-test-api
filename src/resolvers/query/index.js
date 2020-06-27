const Query = {
  user: async (_, { id }, { dataSources: { userAPI }}) => {
    const users = await userAPI.findUsersByIds([id], {});
    return users ? users.map(({ email, name, _id }) => ({ email, name, id: _id })) : [];
  },
  users: async (_, { skip = 0, limit = 10 }, { dataSources: { userAPI }}) => {
    const users = await userAPI.getAllUsers({ skip, limit });
    return users ? users.map(({ email, name, _id }) => ({ email, name, id: _id })) : [];
  }
}

module.exports = Query;
