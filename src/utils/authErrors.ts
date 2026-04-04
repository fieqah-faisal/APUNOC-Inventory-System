export const getAuthErrorMessage = (errorCode?: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact an administrator.";
    case "auth/user-not-found":
      return "No account was found for this email address.";
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    default:
      return "Failed to sign in. Please try again.";
  }
};