import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams } from '@/app/lib/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { BlogPost, BlogPostListResponse, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/app/lib/blogs/definitions';
import { Page } from '@/app/lib/definitions';

export const getBlogs = (searchParams: SearchParams) =>
    fetchAuthenticated<Page<BlogPostListResponse>>(`/blogs?${queryParamsToString(searchParams)}`);

export const getBlogById = (id: number) =>
    fetchAuthenticated<BlogPost>(`/blogs/${id}`);

export const createBlog = (request: CreateBlogPostRequest): Promise<BlogPost> => fetchAuthenticated<BlogPost>("/blogs", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
});

export const updateBlog = (id: number, request: UpdateBlogPostRequest): Promise<BlogPost> => fetchAuthenticated<BlogPost>(`/blogs/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
});

export const deleteBlog = (id: number): Promise<void> => fetchAuthenticated<void>(`/blogs/${id}`, {
    method: "DELETE",
});
