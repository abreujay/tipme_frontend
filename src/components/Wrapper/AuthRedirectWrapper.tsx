import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";


const AuthRedirectWrapper = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/settings");
  }
  return <> {children} </>;
};

export default AuthRedirectWrapper;