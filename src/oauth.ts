import Fastify from "fastify";
import oauthPlugin, { OAuth2Namespace } from "@fastify/oauth2";

const fastify = Fastify();
declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
  export interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    facebookOAuth2: OAuth2Namespace;
  }
}

fastify.register(oauthPlugin, {
  name: "googleOAuth2",
  scope: ["email"],
  credentials: {
    client: {
      id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      secret: process.env.GOOGLE_OAUTH_SECRET,
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: "/login/google",
  callbackUri: "http://localhost:3000/login/google/callback",
  callbackUriParams: {
    access_type: "offline", // will tell Google to send a refreshToken too
  },
});

fastify.get("/login/google/callback", function (request, reply) {
  this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
    request,
    (err, result) => {
      if (err) {
        reply.send(err);
        return;
      }
    }
  );
});

fastify.listen(3000);
