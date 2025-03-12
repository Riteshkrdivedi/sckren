import React, { PropsWithChildren } from "react";
import LandingPageNavbar from "./_components/landingPageNavbar";

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="w-[99vw]">
      <LandingPageNavbar />
      {props.children}
    </div>
  );
};

export default Layout;
