// "use client";

// import React, { useEffect } from "react";
// import {
//   setUser,
//   $loading,
//   $userDetails,
//   UserDetails,
// } from "@/stores/userStore";
// import { db, auth } from "@/firebase/client";
// import { doc, onSnapshot } from "firebase/firestore";
// import { User } from "firebase/auth";

// const UserProvider: React.FC = () => {
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       setUser(user as User);
//       $loading.set(false);

//       if (user) {
//         try {
//           const userDetailsPromise = new Promise<void>((resolve) => {
//             onSnapshot(doc(db, "users", user.uid), (doc) => {
//               resolve();
//               $userDetails.set(doc.data() as UserDetails);
//             });
//           });
//           await Promise.all([userDetailsPromise]);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         await fetch("/api/auth/logout", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   return null;
// };

// export default UserProvider;
