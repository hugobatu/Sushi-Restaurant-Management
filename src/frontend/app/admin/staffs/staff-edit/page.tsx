import React from 'react';
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';
const StaffEditPage = () => {
  return (
    <div className="ml-4 mt-4">
        <Button variant="outline" className="border-black bg-white hover:bg-slate-100 mr-20"><ArrowLeft h-5 w-5/></Button>
        <span className="text-xl">Edit Staff</span>
    </div>
  );
}
export default StaffEditPage;