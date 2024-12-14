'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
<<<<<<< HEAD:src/frontend/components/admin-header.tsx
import { Button } from "@/components/ui/button"
import useScroll from '../hooks/use-scroll';
import { cn } from '../lib/utils';
=======

import useScroll from '../../hooks/use-scroll';
import { cn } from '../../lib/utils';
>>>>>>> d318395fe872dee77d9ffd729ccd74f5cff82575:src/frontend/components/Admin/admin-header.tsx

export function AdminHeader() {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div className="sticky inset-x-0 top-0 z-30 h-12 w-full bg-black">
      <div className="flex h-12 items-center">
        <div className = "static w-1/4">
          <Link
            href="/a"
          >
            <div className="text-white px-7 py-2.5 text-xl">Sushi-Branch Admin</div>
          </Link>
        </div>
        <div className="relative h-full w-full">
          <div className="absolute right-20 top-1">
            <Button className="bg-black hover:bg-gray-800 text-white">Log out</Button>
          </div>
        </div>
      </div>
    </div>
  );
};