const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Correct Email'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Please Enter Valid Email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Minimum Password Lenght is 6 Characters']
    }
});
// fire a function before doc saved to db

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};
const User = mongoose.model('user', userSchema);

module.exports = User;
