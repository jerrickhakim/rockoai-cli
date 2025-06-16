/* @ai: UpdatePasswordForm component for securely changing user password with current password verification in Firebase Authentication */
"use client";

// Third party
import React from "react";
import { Input, Button } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

// Next
import { auth } from "@/firebase/client";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";

// Hooks
import { useUser } from "@/stores/userStore";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const UpdatePasswordForm: React.FC = () => {
  const user = useUser();
  const router = useRouter();

  const validateForm = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (!values.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!values.newPassword) {
      errors.newPassword = "New password is required";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!values.confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (values.confirmNewPassword !== values.newPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ): Promise<void> => {
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error("User not authenticated");
      }

      // Verify current password by re-authenticating
      await signInWithEmailAndPassword(
        auth,
        auth.currentUser.email,
        values.currentPassword,
      );

      // Update password
      await updatePassword(auth.currentUser, values.newPassword);

      addToast({
        title: "Success",
        description: "Password updated successfully",
        color: "success",
      });

      resetForm();
    } catch (error: any) {
      console.error("Error updating password:", error);

      let errorMessage = "Failed to update password";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log in again before changing your password";
      }

      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Input
              className="mb-3"
              label="Current Password"
              name="currentPassword"
              type="password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.currentPassword && !!errors.currentPassword}
              errorMessage={touched.currentPassword && errors.currentPassword}
              autoComplete="current-password"
            />

            <Input
              className="mb-3"
              label="New Password"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.newPassword && !!errors.newPassword}
              errorMessage={touched.newPassword && errors.newPassword}
              autoComplete="new-password"
            />

            <Input
              className="mb-3"
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={values.confirmNewPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={
                touched.confirmNewPassword && !!errors.confirmNewPassword
              }
              errorMessage={
                touched.confirmNewPassword && errors.confirmNewPassword
              }
              autoComplete="new-password"
            />

            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Update Password
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default UpdatePasswordForm;
