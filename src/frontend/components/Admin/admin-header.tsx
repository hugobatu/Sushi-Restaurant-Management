'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '../../hooks/use-scroll';
import { cn } from '../../lib/utils';

export function AdminHeader() {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        //`sticky inset-x-0 top-0 z-30 w-full transition-all`,
        `sticky inset-x-0 top-0 z-30 h-12 w-full bg-black`,
      )}
    >
      <div className = "static w-60">
        <Link
          href="/a"
        >
          <div className="text-white px-7 py-2.5 text-xl">Branch Admin</div>
        </Link>
      </div>
    </div>
  );
};