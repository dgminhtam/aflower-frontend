"use client";

import { Spinner } from "@workspace/ui/components/spinner";
type CreateCategoryRequest = {
  name: string;
  description: string;
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50, "Tên quá dài"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(200, "Mô tả quá dài"),
});

async function createCategoryAPI(data: CreateCategoryRequest): Promise<void> {
  console.log("Đang gửi dữ liệu lên server:", data);
  console.log("Giả lập delay 3 giây...");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Tạo danh mục thành công!");
}

const mockRouter = {
  push: (path: string) => {
    console.log(`Đang điều hướng (mock) đến: ${path}`);
  },
  back: () => {
    console.log("Quay lại (mock)");
  },
};

function CreateCategoryForm() {
  const router = mockRouter;
  const [apiError, setApiError] = useState<string | null>(null);
  // Thêm state cho thông báo thành công
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setApiError(null);
    setApiSuccess(null); // Xóa thông báo cũ
    const createCategoryRequest: CreateCategoryRequest = {
      name: values.name,
      description: values.description,
    };

    try {
      await createCategoryAPI(createCategoryRequest);
      
      // --- YÊU CẦU 2: Bỏ chuyển trang ---
      // router.push('/categories'); // (Đã xóa)
      
      // Thay vào đó, hiển thị thông báo thành công
      setApiSuccess("Tạo danh mục thành công!");

    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.");
      }
      setApiSuccess(null); // Đảm bảo không hiển thị success nếu có lỗi
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tên"
            {...register("name")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            placeholder="Mô tả về danh mục"
            {...register("description")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Hiển thị thông báo thành công */}
        {apiSuccess && (
          <p className="text-sm font-medium text-green-600">{apiSuccess}</p>
        )}
        {/* Hiển thị thông báo lỗi */}
        {apiError && (
          <p className="text-sm font-medium text-red-600">{apiError}</p>
        )}

        <div className="flex space-x-2">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner className="size-5"/> : "Lưu"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateCategoryForm;

