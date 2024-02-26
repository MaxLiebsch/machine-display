'use client'
import React, { ReactNode, useEffect, useState } from "react";
import { getAccount, getSession } from '@/app/lib/services/appwrite.service';
import { redirect, useRouter } from "next/navigation";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authorized, setAuthorized] = useState<boolean>(false); 
  const router = useRouter();
  
  useEffect(() => {
    getSession()
      .then((session) => {
        getAccount()
          .then((account) => {
            if (account) {
              const admin = account.labels.find((label) => label === "admin");
              if (admin) {
                setAuthorized(true);
              } else {
                redirect("/");
              }
            }
          })
          .catch((error) => {});
      })
      .catch(() => {
        router.push("login");
      });
  }, []);

  if (!authorized) {
    return <>Checking your idenity...</>;
  }

  return <div>{children}</div>;
};

export default AuthProvider;
