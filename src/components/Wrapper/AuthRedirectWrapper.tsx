import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


const AuthRedirectWrapper = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/settings");
  }
  return <> {children} </>;
};

export default AuthRedirectWrapper;