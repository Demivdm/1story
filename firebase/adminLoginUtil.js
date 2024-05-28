
export async function checkAdmin(db,uid) {
  try {
    const adminRef = getDocs(collection(db,'admins'));
    console.log("admin is",adminRef)

    const adminDocSnapshot = await adminRef.get();
    if (adminDocSnapshot.exists()) {
      const adminList = adminDocSnapshot.data().uid;
      console.log(adminList)

      return adminList.includes(uid);
      
    }
    return false;

  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
