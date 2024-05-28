export async function checkAdmin(db, uid) {
  try {
    const adminSnapshot = await getDocs(collection(db, 'admins')); // Fetch the documents in the 'admins' collection

    const adminList = adminSnapshot.docs.map(doc => doc.data().uid); // Extract the list of admin UIDs from the documents

    console.log("Admin List:", adminList);

    return adminList.includes(uid); // Check if the given UID is in the list of admin UIDs

  } catch (error) {
    console.error("Error checking admin status:", error);
    return false; // Return false if there's an error
  }
}
// export async function checkAdmin(db,uid) {
//   try {
//     const adminRef = getDocs(collection(db,'admins'));
//     console.log("admin is",adminRef)

//     const adminDocSnapshot = await adminRef.get();
//     if (adminDocSnapshot.exists()) {
//       const adminList = adminDocSnapshot.data().uid;
//       console.log(adminList)

//       return adminList.includes(uid);
      
//     }
//     return false;

//   } catch (error) {
//     console.error("Error checking admin status:", error);
//     return false;
//   }
// }
