const { AuthenticationError } = require('apollo-server-express');
const { User, Books } = require('../models');
const signToken = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, {email}) => {
            return User.findOne({email: email}).populate('savedBooks');
        }
    }
}

module.exports = resolvers;