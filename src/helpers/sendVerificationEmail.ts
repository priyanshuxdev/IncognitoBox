import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyToken: string
): Promise<ApiResponse> {
  try {
    // Send verification email
    await resend.emails.send({
      from: "verify@incognitobox.site",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyToken }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
