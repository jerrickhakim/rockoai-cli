/* @ai: DisplayNameForm component for updating user display name in Firebase Authentication */
"use client";

// Third party
import React from "react";
import { Input, Button } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

// Next
import { auth } from "@/firebase/client";
import { updateProfile } from "firebase/auth";

// Hooks
import { useUser } from "@/stores/userStore";

interface FormValues {
  displayName: string;
}

//
// DisplayNameForm
//

const DisplayNameForm: React.FC = () => {
  const user = useUser();
  const router = useRouter();

  const validateForm = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (!values.displayName) {
      errors.displayName = "Display name is required";
    }

    return errors;
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ): Promise<void> => {
    const { displayName } = values;

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        });

        addToast({
          title: "Success",
          description: "Display name updated successfully",
          color: "success",
        });

        router.refresh();
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error updating display name:", error);

      addToast({
        title: "Error",
        description: "Failed to update display name",
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
          displayName: user.displayName || "",
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
              label="Display Name"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.displayName && !!errors.displayName}
              errorMessage={touched.displayName && errors.displayName}
              autoComplete="given-name"
            />

            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Update Name
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DisplayNameForm;
