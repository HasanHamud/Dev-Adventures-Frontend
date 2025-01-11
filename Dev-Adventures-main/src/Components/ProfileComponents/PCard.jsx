import Avatar from "./Avatar";
import ProfileStats from "./ProfileStats";

function ProfileCard() {
  return (

    
    <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center space-y-6">
      <Avatar />
      <ProfileStats />
    </div>
  );
}

export default ProfileCard;
