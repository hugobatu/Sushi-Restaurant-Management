'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '../hooks/use-scroll';
import { cn } from '../lib/utils';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        //`sticky inset-x-0 top-0 z-30 w-full transition-all`,
        `fixed inset-x-0 top-0 z-30 h-12 w-full transition-all`,
        {
          'bg-black/75 backdrop-blur-lg': scrolled,
          'bg-black': selectedLayout,
        },
      )}
    >
    <div className = "static w-60">
        <Link
          href="/"
        >
          <div className="text-white px-7 py-2.5 text-xl">Branch Admin</div>
        </Link>
    </div>
      <div className=" hidden h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
