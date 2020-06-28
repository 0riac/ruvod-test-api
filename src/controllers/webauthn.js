const WebAuthn = require('webauthn')
const LevelAdapter = require('webauthn/src/LevelAdapter')

const webauthn = new WebAuthn({
  origin: `${process.env.APP_URL}`,
  usernameField: 'username',
  userFields: {
    username: 'username',
    name: 'displayName',
  },
  store: new LevelAdapter('db'),
  rpName: 'Stranger Labs, Inc.',
  enableLogging: true,
})

module.exports = webauthn;
