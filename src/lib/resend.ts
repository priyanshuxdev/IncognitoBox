import { Resend } from "resend";

// The Resend class is a wrapper around the Resend API.
export const resend = new Resend(process.env.RESEND_API_KEY || "");
