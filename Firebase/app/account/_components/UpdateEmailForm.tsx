/* @ai: UpdateEmailForm component for changing user email address in Firebase Authentication with validation */
"use client";

// Third party
import React from "react";
import { Input, Button } from "@heroui/react";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

// Next
import { auth } from "@/firebase/client";
import { updateEmail } from "firebase/auth";

// Hooks
import { useUser } from "@/stores/userStore";

interface FormValues {
  email: string;
}

const UpdateEmailForm: React.FC = () => {
  const user = useUser();
  const router = useRouter();

  const validateForm = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ): Promise<void> => {
    const { email } = values;

    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, email);

        addToast({
          title: "Success",
          description: "Email updated successfully",
          color: "success",
        });

        router.refresh();
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error updating email:", error);

      addToast({
        title: "Error",
        description: "Failed to update email address",
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
          email: user.email || "",
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
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.email && !!errors.email}
              errorMessage={touched.email && errors.email}
              autoComplete="email"
            />

            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Update Email
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateEmailForm;
