import ProjectServerContent from "@/components/MainPage/PageContent/Project/ProjectServerContent";
import React, { Suspense } from "react";

const StudiesPage = () => {
  return (
    <Suspense>
      <ProjectServerContent/>
    </Suspense>
  );
};

export default StudiesPage;