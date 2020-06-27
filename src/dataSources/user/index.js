const { RESTDataSource } = require('apollo-datasource-rest');
const { User } = require('schemes');

class UserAPI extends RESTDataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async findUsersByIds(ids = [], options = {}) {
    const clientId = this.context.client._id;
    const users = await User.find({ _id: { $in: ids }, clientId }, null, options).lean();
    return users ? users : null;
  }

  async getAllUsers(options = {}) {
    const clientId = this.context.client._id;
    const users = await User.find({ clientId }, null, options);
    return users ? users : null;
  }

  async createUser(user = {}) {
    const clientId = this.context.client._id;
    return await User.create({ ...user, clientId });
  }

  async updateUser(id, user = {}) {
    return await User.findOneAndUpdate({ _id: id }, user, { new: true });
  }

  async deleteUser(id) {
    return await User.findOneAndDelete({ _id: id });
  }
}
    
module.exports = UserAPI;
