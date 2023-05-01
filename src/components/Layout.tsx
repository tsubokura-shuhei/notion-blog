import React, { ReactNode } from "react";
import { Navbar } from "./Navbar/Navbar";

export type Props = {
  children: ReactNode;
};

export const Layout = (props: Props) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default Layout;
