"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/utils/error"
import { Role } from "@/config/roles.config"

import { useCreateEmployeeMutation } from "@/features/users/api/user.api"
import { UserForm } from "@/features/users/components/user-form"
import {
  userSchema,
  type UserFormValues,
} from "@/features/users/schemas/user.schema"

const employeeSchema = userSchema.extend({
  role: z.enum([Role.MANAGER, Role.EMPLOYEE]),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation()
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      publicId: "",
      role: Role.EMPLOYEE,
    },
  })

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) form.reset()
  }

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await createEmployee({
        ...values,
        phone: values.phone || undefined,
        avatar: values.avatar || undefined,
      }).unwrap()
      toast.success("Employee invitation sent")
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Unable to create employee")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
          <DialogDescription>
            Create a manager or employee account. A welcome email will be sent.
          </DialogDescription>
        </DialogHeader>
        <form id="create-employee-form" onSubmit={form.handleSubmit(onSubmit)}>
          <UserForm
            form={form as unknown as ReturnType<typeof useForm<UserFormValues>>}
            isSubmitting={isLoading}
            allowedRoles={[Role.MANAGER, Role.EMPLOYEE]}
          />
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-employee-form"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Creating...
              </>
            ) : (
              "Create employee"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
