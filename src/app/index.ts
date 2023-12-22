import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import {User} from './user/index'

export async function initServer(){
    const app: Express = express();
    app.use(bodyParser.json());

    const qraphQlServer = new ApolloServer({
        typeDefs: `
        ${User.types}
            type Query{
                ${User.queries}
            }
        `,
        resolvers:{
            Query:{
                ...User.resolvers.queries,
            }
        }
    });

    await qraphQlServer.start();

    app.use('/graphql', expressMiddleware(qraphQlServer));
    app.listen()

    return app;

}