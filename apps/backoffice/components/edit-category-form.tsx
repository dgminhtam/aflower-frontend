"use client";

import { Category } from "@/app/lib/admin/categories/definitions";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm , ControllerRenderProps } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50, "Tên quá dài"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(200, "Mô tả quá dài"),
});

interface EditCategoryFormProps {
  category: Category;
}

function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updateCategoryRequest = {
      name: values.name,
      description: values.description,
    };

  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<{ name: string; description: string }, "name"> }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: ControllerRenderProps<{ name: string; description: string }, "description"> }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả về danh mục"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Lưu</Button>
          <Button type="button" className="mx-2" variant={'outline'} onClick={() => router.back()}>Hủy</Button>
        </form>
      </Form>
    </>
  );
}

export default EditCategoryForm;