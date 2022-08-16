import { Prisma, PrismaClient } from "@prisma/client";
import Fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { prismaPlugin } from "./plugins/prisma";
import { TodoService } from "./services/todo/service";
import { todoRoutes } from "./services/todo";
import cors from "@fastify/cors";
import oauthPlugin, { OAuth2Namespace } from "@fastify/oauth2";
import config from "./config";
import axios from "axios";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
  export interface FastifyInstance {
    db: PrismaClient;
    todoService: TodoService;
    googleOAuth2: OAuth2Namespace;
  }
}

const fastify = Fastify({
  logger: {
    // ToDo: turn off for prod
    prettyPrint: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

async function decorateFastifyInstance(fastify: FastifyInstance) {
  const todoService = new TodoService(fastify.db);
  fastify.decorate("todoService", todoService);
}

fastify.register(oauthPlugin, {
  name: "googleOAuth2",
  scope: ["email"],
  credentials: {
    client: {
      id: config.googleOAuthClientId,
      secret: config.googleOAuthSecret,
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: "/login/google",
  // facebook redirect here after the user login
  callbackUri: "http://localhost:4000/login/google/callback",
  callbackUriParams: {
    // custom query param that will be passed to callbackUri
    access_type: "offline", // will tell Google to send a refreshToken too
  },
});

fastify.get("/login/google/callback", async function (request, reply) {
  console.log({ request });
  const token = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  const user = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo')
  console.log(user.data)
  
});

fastify
  // .register(todoRoutes)
  .register(cors, {
    origin: (origin, callback) => {
      callback(null, true);
      return;
    },
  })
  .register(prismaPlugin)
  .register(fp(decorateFastifyInstance))
  .register(todoRoutes, { prefix: "/todos" })
  .addHook("preHandler", (request, reply, done) => {
    request.user = {
      id: "1",
    };
    done();
  });

fastify.listen(4000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`
  🚀 Server ready at: http://localhost:4000
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-fastify#3-using-the-rest-api`);
});
