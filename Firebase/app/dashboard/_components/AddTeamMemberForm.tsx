/* @ai: AddTeamMemberForm component for inviting and adding new users to a tenant workspace with role assignment */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, FormikHelpers } from "formik";
import { Input, Button, RadioGroup, Radio } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface FormValues {
  displayName: string;
  email: string;
  role: "admin" | "teamMember";
}

const AddTeamMemberForm: React.FC = () => {
  const { tenantId, tenantPath } = useParams<{
    tenantId: string;
    tenantPath: string;
  }>();
  const router = useRouter();

  const validateForm = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.displayName) {
      errors.displayName = "Name is required";
    } else if (values.displayName.length < 3) {
      errors.displayName = "Name must be at least 3 characters";
    }

    return errors;
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/${tenantPath}/${tenantId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        addToast({
          title: "Success",
          description: data.message,
          color: "success",
        });
        router.push(`/dashboard/${tenantPath}/${tenantId}/users`);
      } else {
        addToast({
          title: "Error",
          description: data.message,
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "An error occurred while adding the team member",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        displayName: "",
        email: "",
        role: "teamMember",
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
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Input
            className="mb-3"
            type="text"
            label="Name"
            name="displayName"
            value={values.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.displayName && !!errors.displayName}
            errorMessage={touched.displayName && errors.displayName}
          />

          <Input
            className="mb-3"
            type="email"
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.email && !!errors.email}
            errorMessage={touched.email && errors.email}
            autoComplete="email"
          />

          <RadioGroup
            label="Role"
            className="mb-3"
            defaultValue={values.role}
            onChange={(e) => setFieldValue("role", e.target.value)}
            name="role"
          >
            <Radio value="admin">Admin</Radio>
            <Radio value="teamMember">Team Member</Radio>
          </RadioGroup>

          <Button
            type="submit"
            color="primary"
            fullWidth
            isLoading={isSubmitting}
          >
            Add Team Member
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default AddTeamMemberForm;
