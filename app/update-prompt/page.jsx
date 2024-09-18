import { Suspense } from "react";
import dynamic from "next/dynamic";

const EditPrompt = dynamic(() => import("@components/EditPrompt"), {
  suspense: true,
});

const Page = () => {
  return (
    <Suspense>
      <EditPrompt />
    </Suspense>
  );
};

export default Page;