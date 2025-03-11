"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ecomm/ui/form";
import {
  customerCreateSchema,
  type CustomerCreateInput,
} from "@ecomm/validations/customers/customers-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { createCustomer } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TypographyH1, TypographyH2 } from "@ecomm/ui/typography";
import { Separator } from "@ecomm/ui/separator";
import { Loader } from "lucide-react";
import { cn } from "@ecomm/ui/lib/utils";
import { Button } from "@ecomm/ui/button";
import { PasswordInput } from "@ecomm/ui/password-input";
import { Switch } from "@ecomm/ui/switch";
import { CustomerDetailsStage } from "./customer-details-stage";
import { AddressesStage } from "./addresses-stage";

interface Stage {
  title: string;
  key: "customer-details" | "security" | "addresses";
}

const stages: Stage[] = [
  { title: "Customer details", key: "customer-details" },
  { title: "Security", key: "security" },
  { title: "Addresses", key: "addresses" },
];

function useMultiStage(initialStage: Stage["key"]) {
  const [currentStage, setCurrentStage] = useState<Stage["key"]>(initialStage);

  const onNext = () => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage);
    const newStage = stages[currentIndex + 1]?.key;

    if (currentIndex < stages.length - 1 && newStage) {
      setCurrentStage(newStage);
    }
  };

  const onPrevious = () => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage);
    const newStage = stages[currentIndex - 1]?.key;

    if (currentIndex > 0 && newStage) {
      setCurrentStage(newStage);
    }
  };

  const goToStage = (stage: Stage["key"]) => {
    setCurrentStage(stage);
  };

  const isStageDisabled = (stageKey: Stage["key"]) => {
    const currentStageIndex = stages.findIndex(
      (stage) => stage.key === currentStage,
    );
    const disabledStages = stages.filter(
      (_, index) => index > currentStageIndex,
    );

    return disabledStages.some((stage) => stage.key === stageKey);
  };

  return {
    currentStage,
    onNext,
    onPrevious,
    goToStage,
    isStageDisabled,
    isLast: currentStage === "addresses",
  };
}

export function CustomerCreateForm() {
  // TODO(fcasibu): useFormContext is not working properly with react compiler
  "use no memo";

  const form = useForm<CustomerCreateInput>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
      addresses: [],
      email: "",
      phone: "",
      lastName: "",
      birthDate: undefined,
      firstName: "",
      middleName: "",
      authMode: undefined,
      currentStage: "customer-details",
    },
  });

  const {
    currentStage,
    onNext,
    onPrevious,
    goToStage,
    isStageDisabled,
    isLast,
  } = useMultiStage("customer-details");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    form.setValue("currentStage", currentStage);
  }, [currentStage, form]);

  const handleSubmit = (data: CustomerCreateInput) => {
    if (!isLast) return onNext();

    startTransition(async () => {
      const result = await createCustomer(data);

      if (!result.success) {
        switch (result.error.code) {
          case "DUPLICATE_ERROR":
            toast({
              title: "Customer Creation",
              description: "Customer with the same email already exists.",
            });
            break;
          default:
            toast({
              title: "Customer Creation",
              description: "There was an issue with creating a customer.",
            });
        }

        return;
      }

      toast({
        title: "Customer creation",
        description: "Customer was successfully created",
      });

      router.push("/customers");
    });
  };

  return (
    <div>
      <TypographyH1>Create a customer</TypographyH1>
      <StageIndicator
        currentStage={currentStage}
        goToStage={goToStage}
        isStageDisabled={isStageDisabled}
      />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit(handleSubmit)(e);
          }}
        >
          <div className="max-w-3xl mx-auto p-8 space-y-8">
            <StageContent currentStage={currentStage} />

            <StageController
              onPrevious={onPrevious}
              isLast={isLast}
              isPending={isPending}
              currentStage={currentStage}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

function StageController(props: {
  currentStage: Stage["key"];
  isPending: boolean;
  isLast: boolean;
  onPrevious: () => void;
}) {
  const { currentStage, isPending, isLast, onPrevious } = props;

  const router = useRouter();

  return (
    <div className="flex justify-end gap-4">
      <Button
        variant="outline"
        type="button"
        onClick={() => router.push("/customers")}
      >
        Cancel
      </Button>
      {currentStage !== "customer-details" && (
        <Button
          disabled={isPending}
          type="button"
          onClick={onPrevious}
          className="min-w-[120px]"
        >
          {isPending ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            "Previous"
          )}
        </Button>
      )}
      <Button disabled={isPending} type="submit" className="min-w-[120px]">
        {isPending ? (
          <Loader className="animate-spin" size={16} />
        ) : isLast ? (
          "Submit"
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
}

function StageIndicator({
  currentStage,
  goToStage,
  isStageDisabled,
}: {
  currentStage: Stage["key"];
  goToStage: (stage: Stage["key"]) => void;
  isStageDisabled: (stage: Stage["key"]) => boolean;
}) {
  return (
    <div className="flex justify-between gap-6 w-full">
      {stages.map((stage, index) => (
        <div
          key={stage.key}
          className={cn("flex items-center flex-1", {
            "justify-end flex-grow-0": index === stages.length - 1,
          })}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="flex w-[40px] h-[40px] justify-center items-center">
              <Button
                aria-label={`Move to ${stage.title}`}
                variant="none"
                className={cn(
                  "w-[40px] h-[40px] rounded-full outline outline-black flex justify-center items-center",
                  {
                    "outline-none outline-transparent bg-blue-500 outline-offset-0":
                      currentStage === stage.key,
                  },
                )}
                disabled={isStageDisabled(stage.key)}
                onClick={() => goToStage(stage.key)}
                size="icon"
              >
                <span
                  className={cn("text-black pointer-events-none text-lg", {
                    "text-white": currentStage === stage.key,
                  })}
                >
                  {index + 1}
                </span>
              </Button>
            </div>
            <span className="flex-shrink-0">{stage.title}</span>
            {index !== stages.length - 1 && (
              <Separator className="bg-gray-500 !flex-shrink" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StageContent({ currentStage }: { currentStage: Stage["key"] }) {
  switch (currentStage) {
    case "customer-details":
      return <CustomerDetailsStage />;
    case "security":
      return <SecurityStage />;
    case "addresses":
      return <AddressesStage />;
    default:
      throw new Error("Unknown stage");
  }
}

function SecurityStage() {
  const formContext = useFormContext<CustomerCreateInput>();
  const authMode = formContext.watch("authMode");

  return (
    <div>
      <TypographyH2 className="mb-4">Security</TypographyH2>
      <div className="space-y-4">
        <FormField
          control={formContext.control}
          name="authMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Mode</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          formContext.resetField("password", {
                            keepError: false,
                          });

                          formContext.resetField("passwordConfirm", {
                            keepError: false,
                          });
                        }

                        field.onChange(checked);
                      }}
                    />
                    <span>Use external authentication</span>
                  </div>
                  <FormDescription>
                    To use a password or external authentication
                  </FormDescription>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <PasswordInput disabled={authMode} {...field} />
                  <FormDescription>
                    You won&apos;t be able to change password afterwards.
                  </FormDescription>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput disabled={authMode} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
