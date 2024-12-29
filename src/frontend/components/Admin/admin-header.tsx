'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Button } from "@/components/ui/button";
import useScroll from '../../hooks/use-scroll';
import { cn } from '../../lib/utils';

export function AdminHeader() {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const [username, setUsername] = useState<string | null>(null);

  return (
    <div className="sticky inset-x-0 top-0 z-30 h-12 w-full bg-black">
      <div className="flex h-12 items-center">
        <div className = "static w-1/4">
          <Link
            href="/a"
          >
            <div className="text-white px-7 py-2.5 text-xl">Sushi - Branch Admin</div>
          </Link>
        </div>
        <div className="relative h-full w-full">
          <div className="absolute right-20 top-1">
          <Button
            className="bg-black hover:bg-gray-800"
            onClick={() => {
              localStorage.removeItem("token");
              setUsername(null);
              window.location.href = "/";
              localStorage.removeItem("cart");
              localStorage.removeItem("checkedItems");
              localStorage.removeItem("totalAmount");
              document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }}
          >
            ĐĂNG XUẤT
          </Button>
            </div>
          </div>
        </div>
      </div>
  );
};