"use client";

import { SnackbarProvider } from "notistack";

function SnackProvider({ children }: React.PropsWithChildren) {
  return <SnackbarProvider>{children}</SnackbarProvider>;
}

export default SnackProvider;
