import { fetchUser } from "@/app/api/users";
import EditProfileForm from "@/components/EditProfileForm";
import { currentUser } from "@clerk/nextjs/server"

export default async function EditProfilePage() {
  const user = await currentUser()
  const userDetails = await fetchUser(user?.id ?? '');
  
  return userDetails ? (
    <EditProfileForm userDetails={userDetails} />
  ) : <>User data not found</>
}