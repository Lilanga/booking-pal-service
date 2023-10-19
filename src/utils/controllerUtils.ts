import { verifyApiToken } from "../lib/auth";
import { APIContext, ApiAuthError } from "../controllers/types";

export const validateApiKey = async (context: APIContext): Promise<void> => {
    if(!await verifyApiToken(context)){
      throw new ApiAuthError("Unauthorized, invalid API key or calendar ID");
    }
  };