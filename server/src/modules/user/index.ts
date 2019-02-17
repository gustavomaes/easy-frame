import UserType from './UserType';
import * as Loader from './UserLoader';
import createConnection from '../utils/createCoonnection';
import { ForbiddenError } from 'apollo-server';

import { GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLString, GraphQLInputObjectType } from 'graphql';

const isAuthenticated = (me, resolver) => me ? resolver : new Error('Not authenticated')

export const queries = {
  me: {
    type: UserType,
    resolve:  (object, args, { me }) => isAuthenticated(me, me)
  },
  users: {
    type: createConnection(UserType, 'UserConnection'),
    args: {
      size: {
        type: GraphQLNonNull(GraphQLInt),
      },
      page: {
        type: GraphQLNonNull(GraphQLInt),
      }
    },
    resolve: (object, args, ctx) => isAuthenticated(ctx.me, Loader.Users(object, args, ctx))
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (object, args, ctx) => isAuthenticated(ctx.me, Loader.User(object, args, ctx))
  }
}

export const mutations = {
  addUser: {
    type: UserType,
    args: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'AddUserInput',
          fields: () => ({
            name: {
              type: (GraphQLString)
            },
            email: {
              type: (GraphQLString)
            },
            password: {
              type: (GraphQLString)
            },
          }),
        })
      }
    },
    resolve: Loader.AddUser
  },
  loginUser: {
    type: UserType,
    args: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'LoginUserInput',
          fields: () => ({
            email: {
              type: (GraphQLString)
            },
            password: {
              type: (GraphQLString)
            },
          }),
        })
      }
    },
    resolve: Loader.LoginUser
  }
}