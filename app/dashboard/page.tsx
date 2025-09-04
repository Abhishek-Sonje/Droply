import { redirect } from "next/navigation";

function Dashboard() {
  redirect("/dashboard/files");
}

export default Dashboard;
