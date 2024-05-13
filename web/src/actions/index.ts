import * as Figma from "figma-js";

export const getFigmaUser = async (token: string) => {
  const client = Figma.Client({
    personalAccessToken: token,
  });
  return await client.me();
};
