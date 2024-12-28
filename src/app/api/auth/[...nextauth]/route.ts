import NextAuth from "next-auth";
import { options } from "./options";

// This is the route that NextAuth uses to handle all of its requests.
//it takkes the options object that we created in the options.ts file and passes it to the NextAuth function.
const handler = NextAuth(options);

export { handler as GET, handler as POST };
