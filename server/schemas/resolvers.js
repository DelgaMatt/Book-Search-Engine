const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('savedBooks');
        },
        user: async (parent, {email}) => {
            return User.findOne({email: email}).populate('savedBooks');
        },
    },

    Mutation: {
        createUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});

            if (!username || !email || !password) {
                throw new Error('Please enter a username, email, and password');
            };

            const token = signToken(user);
            return { token, user }; 
        },
        login: async (parent, {email, password}) => {
            const user = User.findOne({email});

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            };

            const correctPW =  await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticationError('Incorrect credentials')
            };

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData }},
                    { new: true }
                )
                .populate('Books');

                return user;
            }

            throw new AuthenticationError('You need to be logged in to save a book!')
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findOneAndDelete(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                )

                return user;
            }

            throw new AuthenticationError('You need to be logged in to delete a book!')
        }


    }
}

module.exports = resolvers;