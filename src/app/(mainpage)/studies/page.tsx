import StudiesServerContent from "@/components/MainPage/PageContent/Study/StudiesServerContent";
import React, { Suspense } from "react";

const StudiesPage = () => {
  return (
    <Suspense>
      <StudiesServerContent/>
    </Suspense>
  );
};

export default StudiesPage;