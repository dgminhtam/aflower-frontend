"use client";

import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Spinner } from '@workspace/ui/components/spinner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const PAGE_SIZE_OPTIONS = [12, 20, 40, 80];

export function AppSelectPageSize() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pageSize = Number(searchParams.get('size')) || 12;

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', newPageSize.toString());
    params.set('page', '1'); 
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Items per page:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"} disabled={isPending}>
            {isPending ? <Spinner/> : pageSize}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <DropdownMenuItem key={size} onClick={() => handlePageSizeChange(size)}>
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}