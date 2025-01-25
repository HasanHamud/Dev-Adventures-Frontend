import Navbar from "../../Components/Navigators/Navbar";
import ProfileCard from "../../Components/ProfileComponents/PCard";
import ProfileTabs from "../../Components/ProfileComponents/ProfileTabs";

function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-900">
      <Navbar />
      <div className="flex-col items-center justify-center overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4  pt-24">
          <ProfileCard />
          <ProfileTabs />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
