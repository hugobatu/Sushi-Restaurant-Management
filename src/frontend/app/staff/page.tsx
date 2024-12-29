// import { StaffSection } from "../../components/StaffPage/staff-section";
// import { StaffHeader } from "../../components/StaffPage/staff-header";
// const StaffPage = () => {
//     return (
//         <>
//             <StaffHeader />
//             <StaffSection />
//         </>
//     );
// };

// export default StaffPage;




"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const StaffPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/staff/checkorder");
    }, [router]);

    return null; // Không cần render gì khi đang redirect
};

export default StaffPage;
