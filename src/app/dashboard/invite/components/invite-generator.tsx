"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField } from "./ui/form"; // Assuming FormField is exported from here
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { ToggleGroup } from "./ui/toggle-group";
import { GeneratedLink } from "./ui/generated-link";
import { Toast } from "./ui/toast";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

type FormValues = {
  email: string;
  role: "viewer" | "admin" | "editor";
  expiration: "24h" | "3d" | "7d";
};

interface InviteGeneratorProps {
  defaultValues?: Partial<FormValues>;
  onGenerate?: (data: FormValues) => Promise<string | undefined>;
  className?: string;
}

const InviteGenerator: React.FC<InviteGeneratorProps> = ({
  defaultValues = {
    role: "viewer",
    expiration: "3d",
  },
  onGenerate,
  className,
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});

  // Destructure 'control' here to use it with Controller components
  const {
    register,
    handleSubmit,
    watch,
    control, 
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });

  const roleOptions = [
    { value: "viewer", label: "Viewer" },
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
  ];

  const expirationOptions = [
    { value: "24h", label: "24h" },
    { value: "3d", label: "3d" },
    { value: "7d", label: "7d" },
  ];

  const validateForm = (data: FormValues): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (data: FormValues) => {
    if (!validateForm(data)) return;
    setIsLoading(true);
    try {
      const link = await onGenerate?.(data);
      if (link) {
        setGeneratedLink(link);
        setIsSuccess(true);
        reset();
      }
    } catch (error) {
      console.error("Failed to generate invite:", error);
      setErrors({ email: "Failed to generate invite. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      console.log("Link copied to clipboard");
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      {isSuccess && (
        <Toast
          variant="success"
          description="Invite link created successfully"
          showClose
          onClose={() => setIsSuccess(false)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Email */}
        <FormField label="Recipient Email" required error={errors.email}>
          <Input
            {...register("email")}
            type="email"
            placeholder="Enter recipient's email"
            leftIcon={<Mail className="h-4 w-4" />}
            disabled={isLoading}
          />
        </FormField>

        {/* Assigned Role - Using Controller */}
        <FormField label="Assigned Role" required error={errors.role}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={roleOptions}
                disabled={isLoading}
              />
            )}
          />
        </FormField>

        {/* Link Expiration - Using Controller */}
        <FormField label="Link Expiration" required error={errors.expiration}>
          <Controller
            name="expiration"
            control={control}
            render={({ field }) => (
              <ToggleGroup
                options={expirationOptions}
                value={field.value}
                onChange={field.onChange}
                // disabled={isLoading}
              />
            )}
          />
        </FormField>

        {generatedLink && (
          <GeneratedLink
            link={generatedLink}
            description={`This link will expire in ${
              watch("expiration") === "24h"
                ? "24 hours"
                : watch("expiration") === "3d"
                ? "72 hours"
                : "7 days"
            }.`}
            onCopy={handleCopyLink}
          />
        )}

        <Button
          type="submit"
          isLoading={isLoading || isSubmitting}
          className="w-full mt-6"
          size="lg"
        >
          Generate Invite Link
        </Button>
      </form>
    </div>
  );
};

export { InviteGenerator };