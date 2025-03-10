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
  addressCreateSchema,
  customerCreateSchema,
  type AddressCreateInput,
  type CustomerCreateInput,
} from "@ecomm/validations/customers/customers-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState, useTransition } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { createCustomer } from "../services/mutations";
import { toast } from "@ecomm/ui/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@ecomm/ui/input";
import { Text, TypographyH1, TypographyH2 } from "@ecomm/ui/typography";
import { Separator } from "@ecomm/ui/separator";
import { Circle, Loader, Plus } from "lucide-react";
import { CalendarInput } from "@ecomm/ui/calendar-input";
import { cn } from "@ecomm/ui/lib/utils";
import { Button } from "@ecomm/ui/button";
import { PasswordInput } from "@ecomm/ui/password-input";
import { Switch } from "@ecomm/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ecomm/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ecomm/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";

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

  return {
    currentStage,
    onNext,
    onPrevious,
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

  const { currentStage, onNext, onPrevious, isLast } =
    useMultiStage("customer-details");

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
      <StageIndicator currentStage={currentStage} />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(handleSubmit)(e);
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

function StageIndicator({ currentStage }: { currentStage: Stage["key"] }) {
  return (
    <div className="flex justify-between gap-6 w-full">
      {stages.map((stage, index) => (
        <Fragment key={stage.key}>
          <div
            className={cn("flex items-center flex-1", {
              "justify-end flex-grow-0": index === stages.length - 1,
            })}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex w-[40px] h-[40px]">
                <Circle
                  className={cn("stroke-1", {
                    "fill-blue-500 stroke-transparent":
                      currentStage === stage.key,
                  })}
                  size={40}
                />
                <span
                  className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black",
                    {
                      "text-white": currentStage === stage.key,
                    },
                  )}
                >
                  {index + 1}
                </span>
              </div>
              <span className="flex-shrink-0">{stage.title}</span>
              {index !== stages.length - 1 && (
                <Separator className="bg-gray-500 !flex-shrink" />
              )}
            </div>
          </div>
        </Fragment>
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

function CustomerDetailsStage() {
  const formContext = useFormContext<CustomerCreateInput>();

  return (
    <div>
      <TypographyH2 className="mb-4">Customer Details</TypographyH2>
      <div className="space-y-4">
        <FormField
          control={formContext.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formContext.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <CalendarInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
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
                <PasswordInput disabled={authMode} {...field} />
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

function AddressesStage() {
  const formContext = useFormContext<CustomerCreateInput>();

  return (
    <div>
      <TypographyH2 className="mb-4">Addresses</TypographyH2>
      <FormField
        control={formContext.control}
        name="addresses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Addresses</FormLabel>
            <FormControl>
              <AddressControl {...field} value={field.value ?? []} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface AddressControlProps {
  value: AddressCreateInput[];
  onChange: (value: AddressCreateInput[]) => void;
}

function AddressControl({ value, onChange, ...props }: AddressControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<AddressCreateInput | null>(
    null,
  );

  const form = useForm<AddressCreateInput>({
    resolver: zodResolver(addressCreateSchema),
    defaultValues: {
      type: "BILLING",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const handleSubmit = (data: AddressCreateInput) => {
    onChange(
      currentItem
        ? value.map((item) =>
            JSON.stringify(item) === JSON.stringify(currentItem) ? data : item,
          )
        : [...value, data],
    );

    resetAndClose();
  };

  const handleRemove = () => {
    if (!currentItem) return;

    onChange(
      value.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(currentItem),
      ),
    );
    resetAndClose();
  };

  const resetAndClose = () => {
    form.reset({});
    setIsOpen(false);
    setCurrentItem(null);
  };

  const handleAddressClick = (item: AddressCreateInput) => {
    form.reset(item);
    setCurrentItem(item);
  };

  const handleSheetOpenChange = (open: boolean) => {
    form.reset({});
    setIsOpen(open);

    if (!open) {
      setCurrentItem(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" type="button" className="flex">
          <input className="sr-only" type="button" {...props} />
          <Plus />
          Add Address
        </Button>
      </SheetTrigger>

      {!value?.length ? (
        <Text>There are no addresses associated with this customer.</Text>
      ) : (
        <AddressTable
          handleAddressClick={handleAddressClick}
          addresses={value}
        />
      )}

      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              return form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <SheetHeader>
              <SheetTitle>
                {currentItem ? "Edit address" : "Create an address"}
              </SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="BILLING">Billing</SelectItem>
                          <SelectItem value="SHIPPING">Shipping</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex gap-2">
              {currentItem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              )}
              <Button type="submit">
                {currentItem ? "Update address" : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function AddressTable({
  addresses,
  handleAddressClick,
}: {
  addresses: AddressCreateInput[];
  handleAddressClick: (item: AddressCreateInput) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Street</TableHead>
          <TableHead>City</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Postal code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address, index) => (
          <SheetTrigger asChild key={index}>
            <TableRow
              className="cursor-pointer"
              onClick={() => handleAddressClick(address)}
            >
              <TableCell>{address.type}</TableCell>
              <TableCell>{address.street}</TableCell>
              <TableCell>{address.city}</TableCell>
              <TableCell>{address.state}</TableCell>
              <TableCell>{address.country}</TableCell>
              <TableCell>{address.postalCode}</TableCell>
            </TableRow>
          </SheetTrigger>
        ))}
      </TableBody>
    </Table>
  );
}
