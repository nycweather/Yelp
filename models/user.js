const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passpoertLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
});
userSchema.plugin(passpoertLocalMongoose);

module.exports = mongoose.model('User', userSchema);