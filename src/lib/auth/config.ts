export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_kevkQoqOa",
  client_id: "6o2uld1loe0t9f07smc7sb98n1",
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid phone",
};
