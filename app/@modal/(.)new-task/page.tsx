"use client";

import { useRouter } from "next/navigation";
import TaskForm from "@/components/task-form";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NewTask } from "@/types/task";
import ModalPanel from "@/components/tasks/ModalPanel";
import { useEffect, useState } from "react";

export default function NewTaskModal() {
  const router = useRouter();
  const { createTask } = useTask();
  const { startFocus } = useFocus();
  // Read window width synchronously so there's no flash
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      // Replace so back button works correctly
      router.replace("/new-task");
    }
  }, []); // ← runs once on mount, no deps

  // null = not yet measured, render nothing to avoid flash
  if (isMobile === null || isMobile) return null;

  const handleSubmit = async (data: NewTask) => {
    await createTask(data);
    router.back();
  };

  const handleSubmitWithFocus = async (data: NewTask) => {
    const created = await createTask(data);
    startFocus(created, { path: "/home", viewedDate: null });

    if (isMobile) {
      router.push("/focus");
    } else {
      // router.push("/dashboard");
      router.back();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => router.back()}
      />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <ModalPanel onClose={() => router.back()} mode="create" />

          {/* Form */}
          <div className="px-6 pb-6">
            <TaskForm
              mode="create"
              onSubmit={handleSubmit}
              onSubmitWithFocus={handleSubmitWithFocus}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// "use client";

// import { useRouter } from "next/navigation";
// import TaskForm from "@/components/task-form";
// import { useTask } from "@/presentation/context/TaskContext";
// import { useFocus } from "@/presentation/context/FocusContext";
// import { NewTask } from "@/types/task";
// import ModalPanel from "@/components/tasks/ModalPanel";

// export default function NewTaskModal() {
//   const router = useRouter();
//   const { createTask } = useTask();
//   const { startFocus } = useFocus();

//   const handleSubmit = async (data: NewTask) => {
//     await createTask(data);
//     router.back();
//   };

//   const handleSubmitWithFocus = async (data: NewTask) => {
//     const created = await createTask(data);
//     startFocus(created, { path: "/home", viewedDate: null });
//     router.back();
//   };

//   // On mobile: render the form directly, full page, no modal chrome
//   // On desktop: render with backdrop + modal panel
//   return (
//     <>
//       {/* Backdrop — hidden on mobile, visible on desktop */}
//       <div
//         className="hidden md:block fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//         onClick={() => router.back()}
//       />

//       {/* On mobile: full page layout */}
//       <div className="md:hidden min-h-screen bg-white px-4 py-6">
//         <ModalPanel onClose={() => router.back()} mode="create" />
//         <TaskForm
//           mode="create"
//           onSubmit={handleSubmit}
//           onSubmitWithFocus={handleSubmitWithFocus}
//         />
//       </div>

//       {/* On desktop: centered modal */}
//       <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 pointer-events-none">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
//           <ModalPanel onClose={() => router.back()} mode="create" />
//           <div className="px-6 pb-6">
//             <TaskForm
//               mode="create"
//               onSubmit={handleSubmit}
//               onSubmitWithFocus={handleSubmitWithFocus}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
