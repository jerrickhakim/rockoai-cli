/* @ai: AccountDetailsForm component for updating user profile information like first name, last name, and phone number in Firestore */
"use client";

import React from "react";
import { Formik, FormikHelpers, FormikErrors } from "formik";
import { Input, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";

import { useUserDetails } from "@/stores/userStore";
import { auth, db } from "@/firebase/client";
import { doc, setDoc } from "firebase/firestore";

interface FormValues {
  firstName: string;
  lastName: string;
  phone: string;
}

const AccountDetailsForm: React.FC = () => {
  const userDetails = useUserDetails();

  const validateForm = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};

    if (!values.firstName) {
      errors.firstName = "First name is required";
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!values.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = "Invalid phone number (must be 10 digits)";
    }

    return errors;
  };

  const handleSubmit = async (values: FormValues): Promise<void> => {
    const { firstName, lastName, phone } = values;

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not authenticated");
      }

      const userId = user.uid;

      // Set the document in Firestore
      await setDoc(doc(db, `users/${userId}`), {
        firstName,
        lastName,
        phone,
        updatedAt: new Date(),
      });

      addToast({
        title: "Success",
        description: "Account details updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error saving document:", error);

      addToast({
        title: "Error",
        description: "Failed to update account details",
        color: "danger",
      });
    }
  };

  const initialValues = {
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    phone: userDetails?.phone || "",
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={handleSubmit}
        enableReinitialize
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
              label="First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.firstName && !!errors.firstName}
              errorMessage={touched.firstName && (errors.firstName as string)}
              autoComplete="given-name"
            />
            <Input
              className="mb-3"
              label="Last Name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.lastName && !!errors.lastName}
              errorMessage={touched.lastName && (errors.lastName as string)}
              autoComplete="family-name"
            />

            <Input
              className="mb-3"
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.phone && !!errors.phone}
              errorMessage={touched.phone && (errors.phone as string)}
              autoComplete="tel"
            />

            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Update Details
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AccountDetailsForm;
