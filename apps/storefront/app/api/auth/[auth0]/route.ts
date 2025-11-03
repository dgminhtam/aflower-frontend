// Dùng cho cả 2 file:
// .../app/api/auth/[auth0]/route.ts

import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  // Tùy chỉnh "login" để nó yêu cầu token cho Backend Java
  login: handleLogin({
    authorizationParams: {
      // Gửi 'audience' (API Identifier) đến Auth0
      audience: process.env.AUTH0_AUDIENCE, 
    },
  }),
});