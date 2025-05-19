"use client"

// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, useForm } from "react-hook-form"
import { z } from "zod"

// import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PresentationPeriodType } from "@/Presentation_legacy/types/enum/presentation.type.enum"
import { PresentationTimeType } from "./RegisterForm"

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
})

export function SelectForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    console.log("submit")
  }

  return (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                {/* <Link href="/examples/forms">email settings</Link>. */}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
  )
}

interface RegisterTimeSelectProps {
    control: Control<any>;
    name: string;
    title: string;
}

export const RegisterTimeSelect: React.FC<RegisterTimeSelectProps> = ({control, title, name }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
            <FormItem>
                <FormLabel className="text-base text-black font-medium sm:text-lg">{title}</FormLabel> 
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="w-full lg:w-80 md:w-48 px-3 py-2 text-sm sm:text-base border rounded-md">
                        <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value={PresentationTimeType.HALF}>{PresentationTimeType.HALF}</SelectItem>
                    <SelectItem value={PresentationTimeType.HOUR}>{PresentationTimeType.HOUR}</SelectItem>
                    <SelectItem value={PresentationTimeType.HOUR_HALF}>{PresentationTimeType.HOUR_HALF}</SelectItem>
                    </SelectContent>
                </Select>
                {/* <FormMessage /> */}
            </FormItem>
            )}
        />
    )
}