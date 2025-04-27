import React, { Suspense } from "react";
import AllServerContent from "@/components/MainPage/PageContent/All/AllServerContent";

const AllPage = () => {
  return (
    <Suspense>
      <AllServerContent />
    </Suspense>
  );
};

export default AllPage;
