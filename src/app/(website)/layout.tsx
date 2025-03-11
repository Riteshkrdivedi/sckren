import React, { PropsWithChildren } from "react";
import LandingPageNavbar from "./_components/landingPageNavbar";

const Layout = (props: PropsWithChildren) => {
  return (
    <div>
      <LandingPageNavbar />
      {props.children}
    </div>
  );
};

export default Layout;
