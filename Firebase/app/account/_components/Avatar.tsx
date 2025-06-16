/* @ai: Avatar component for uploading, displaying, and managing user profile pictures with Firebase Storage integration */
"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { User, updateProfile, getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Icon from "@mdi/react";
import { mdiDeleteCircle } from "@mdi/js";
import { addToast } from "@heroui/toast";
import Image from "next/image";

import { useUser, setUser } from "@/stores/userStore";
import { auth, storage } from "@/firebase/client";

const AvatarUpload: React.FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const user = useUser();

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Create a reference to the location where we want to upload the file
      const storageRef = ref(storage, `users/${user?.uid}/${file.name}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update the user's profile with the new photo URL
      await setProfileUrl(downloadURL);

      addToast({
        title: "Success",
        description: "Profile picture updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      addToast({
        title: "Error",
        description: "Failed to upload profile picture",
        color: "danger",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: "",
        });

        const _auth = getAuth();
        setUser({ ..._auth.currentUser, photoURL: "" } as User);

        addToast({
          title: "Success",
          description: "Profile picture removed",
          color: "success",
        });
      }
    } catch (error) {
      console.error("Error removing avatar:", error);

      addToast({
        title: "Error",
        description: "Failed to remove profile picture",
        color: "danger",
      });
    }
  };

  const setProfileUrl = async (url: string): Promise<void> => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: url,
      });

      const _auth = getAuth();
      setUser({ ..._auth.currentUser, photoURL: url } as User);
    }
  };

  const handleAvatarClick = (): void => {
    inputFileRef.current?.click();
  };

  return (
    <div className="relative h-[64px] w-[64px]">
      {user?.photoURL && (
        <button
          className="absolute top-[-3px] right-[-3px] z-10 rounded-full bg-red-600 text-white"
          onClick={handleRemoveAvatar}
          type="button"
          aria-label="Remove avatar"
        >
          <Icon path={mdiDeleteCircle} size={1} />
        </button>
      )}

      <button
        className="flex h-[64px] w-[64px] flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
        onClick={handleAvatarClick}
        type="button"
        aria-label="Upload avatar"
      >
        {user?.photoURL ? (
          <div className="relative">
            <Image
              src={user.photoURL}
              className="h-[64px] w-[64px] rounded-full border border-gray-200 object-cover"
              alt="User avatar"
              width={64}
              height={64}
            />
          </div>
        ) : (
          <span className="text-3xl text-gray-500">
            {user?.displayName?.charAt(0) || "?"}
          </span>
        )}
      </button>

      <input
        name="file"
        className="hidden"
        ref={inputFileRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        required
      />
    </div>
  );
};

export default AvatarUpload;
