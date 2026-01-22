import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { 
  // All routes inside /dashboard will now require login
  matcher: ["/dashboard/:path*"] 
};