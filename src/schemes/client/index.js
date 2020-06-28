const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    email: String,
    name: {type: String, default: ''},
    hashedPassword: String,
    salt: String,
    github_id: String,
});

ClientSchema.statics.exceptFieldsArray = ['hashedPassword', 'salt'];
ClientSchema.statics.removeBannedFields = data => ClientSchema.statics.exceptFieldsArray.forEach(x => { data[x] = undefined; });
ClientSchema.statics.exceptFields = ClientSchema.statics.exceptFieldsArray.map(x => '-' + x).join(' ');

ClientSchema
		.virtual('password')
		.set(function(password) {
			this._password = password;
			this.salt = this.makeSalt();
			this.hashedPassword = this.encryptPassword(password);
		})
		.get(function() {
			return this._password;
		});


ClientSchema.methods = {
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashedPassword;
	},

	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		const salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('base64');
	}
};

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
