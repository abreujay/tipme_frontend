import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HomeClientPage from "./homeClientPage";

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  return <HomeClientPage />;
};

export default HomePage;