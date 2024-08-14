// EditModal.tsx
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../hook/useToast";
import useCurrentUser from "../../hook/useCurrentUser";
import useUsers from "../../hook/useUsers";
import { useEditModal } from "@/app/hook/useModal";
import Modal from "../Modal";
import Input from "../Input";
import Image from "next/image";

const EditModal: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchUser } = useUsers(currentUser?.id);
  const toast = useToast();
  const [profileImage, setProfileImage] = useState<string | File | null>(null);
  const [coverImage, setCoverImage] = useState<string | File | null>(null);
  const [work, setWork] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");

  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setProfileImage(currentUser.avatar);
      setCoverImage(currentUser.coverphoto);
      setBio(currentUser.bio || "");
      setWork(currentUser.work || "");
      setSkills(currentUser.skills || "");
      setLocation(currentUser.location || "");
    }
  }, [currentUser]);

  const editModal = useEditModal();

  const handleFileChangeCover = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        // setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.imageURL);
        const imageURL = response.data.imageURL;
        setCoverImage(imageURL);
        // setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleFileChangeAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        // setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.imageURL);
        const imageURL = response.data.fileURL;
        setProfileImage(imageURL);
        // setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.put("/api/user", {
        bio,
        username,
        profileImage,
        coverImage,
        location,
        work,
        skills,
      });

      mutateFetchUser();
      editModal.onClose();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [username, bio, profileImage, coverImage, location, work, skills, mutateFetchUser, editModal, toast]);

  console.log(coverImage);
  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      deactionLabel="Cancel"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div
              className="relative w-full h-32 bg-gray-200 flex justify-center items-center overflow-hidden cursor-pointer"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverImage && (
                <Image src={
                  typeof coverImage === "string"
                  ? coverImage
                  : ""
                } alt="Cover" className="w-full h-full object-cover"  width={100} height={100}
                />
              )}
              <input
                type="file"
                id="cover"
                onChange={handleFileChangeCover}
                ref={coverInputRef}
                style={{ display: "none" }}
                accept="image/*"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div
              className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center cursor-pointer"
              onClick={() => profileInputRef.current?.click()}
            >
              {profileImage && (
                <Image src={
                    typeof profileImage === "string"
                    ? profileImage
                    : ""
                  } alt="Profile" className="w-full h-full object-cover"  width={100} height={100}
                />
              )}
              <input
                type="file"
                onChange={handleFileChangeAvatar}
                ref={profileInputRef}
                style={{ display: "none" }}
                accept="image/*"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          <Input
            disabled={isLoading}
            label="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <Input
            disabled={isLoading}
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700">Location</label>
          <Input
            disabled={isLoading}
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700">Work</label>
           <Input
            disabled={isLoading}
            label="Work"
            value={work}
            onChange={(e) => setWork(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-700">Skills</label>
           <Input
            disabled={isLoading}
            label="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
      }
    />
  );
};

export default EditModal;
