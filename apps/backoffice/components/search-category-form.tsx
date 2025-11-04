"use client";

import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string()
});

const SearchCategoryForm = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams();
  const searchParams = useSearchParams();
  const defaultName = searchParams.get("name[containsIgnoreCase]") || "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.name.trim() !== "") {
      params.append("name[containsIgnoreCase]", values.name.trim());
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 items-center gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<{ name: string; description: string }, "name"> }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Tìm theo tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tìm kiếm
          </Button>
        ) : (
          <Button type="submit">
            Tìm
          </Button>
        )}
      </form>
    </Form>
  );
};

export { SearchCategoryForm };

