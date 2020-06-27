const UserAPI = require('./user');

const dataSources = () => ({
  userAPI: new UserAPI()
})

module.exports = dataSources;
