"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./user/UserAuthProvider"; 
import { UserSignupProvider } from "./user/UserSignupProvider"; 
import ContextProvider from "./ContextProvider"; 

const queryClient = new QueryClient();

const CombinedProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <UserSignupProvider>
          <ContextProvider>
            {children}
          </ContextProvider>
        </UserSignupProvider>
      </UserAuthProvider>
    </QueryClientProvider>
  );
};

export default CombinedProviders;
