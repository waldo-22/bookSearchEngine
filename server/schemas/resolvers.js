const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, {userId}) => {
        return User.findOne({_id: userId});
    },
    users: async (parent) => {
        return User.find();
    },
},


  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { title ,authors, description, bookId, image} , context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          { $push: { savedBooks: {title, authors, description, bookId, image }}},
          { new: true}
        );
          return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id} ,
          {$pull: {savedBooks: {bookId}}},
          {new: true}
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
