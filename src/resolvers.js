import { User } from "./models/user";

export const resolvers = {
  Query: {
    helloWorld: () => "Hi",
    users: () => User.find()
  },
  Mutation: {
    createUser: async (_, { email, first_name, last_name }) => {
      const user = new User({ email, first_name, last_name });
      await user.save();
      return user;
    }
  }
};
