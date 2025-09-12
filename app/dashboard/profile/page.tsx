import NavbarPage from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
// import { Navbar } from "@heroui/react";

function ProfilePage() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#EAE7DD] via-[#D9D4C7] to-[#F5F5F0] p-2">
      <NavbarPage activeTab="profile" />
      <ProfileCard />
    </div>
  );
}

export default ProfilePage;
