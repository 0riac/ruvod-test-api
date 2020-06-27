const Mutation = {
  createUser: async (_, { input: user }, { dataSources: { userAPI } }) => {
    const { email, name, _id } = await userAPI.createUser(user);
    return { email, name, id: _id };
  },

  updateUser: async (_, { id, input: user }, { dataSources: { userAPI } }) => {
    const { email, name, _id } = await userAPI.updateUser(id, user);
    return { email, name, id: _id };
  },

  deleteUser: async (_, { id }, { dataSources: { userAPI } }) => {
    const user = await userAPI.deleteUser(id);
    
    if (user) {
      const { email, name, _id } = user;
      return { email, name, id: _id };
    } else {
      return null;
    }
  }
}

module.exports = Mutation;
