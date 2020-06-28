const WebAuthn = require('./src')
const LevelAdapter = require('webauthn/src/LevelAdapter')

const webauthn = new WebAuthn({
  origin: `${process.env.APP_URL}`,
  usernameField: 'username',
  userFields: {
    username: 'username',
    name: 'displayName',
  },
  store: new LevelAdapter('db'),
  // store: {
  //   put: async (id, value) => {/* return <void> */},
  //   get: async (id) => {/* return User */},
  //   search: async (search) => {/* return { [username]: User } */},
  //   delete: async (id) => {/* return boolean */},
  // },
  rpName: 'Stranger Labs, Inc.',
  enableLogging: true,
})

module.exports = webauthn;
