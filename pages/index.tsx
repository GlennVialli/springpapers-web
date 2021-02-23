import Home from "./home";
import React from "react";
import Layout, { RouterLayout } from "../components/layout";
import About from "./about";
import FullpageVerticalHashRoute from "../components/fullpage-vertical-hashroute/fullpage-vertical-hashroute";
import FullpageHorizontalHashRoute from "../components/fullpage-horizontal-hashroute/fullpage-horizontal-hashroute";
import Catalogue from "./catalogue";

type SectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  routerLayout: RouterLayout;
  component: JSX.Element;
};

type SectionRefMap = Record<string, SectionRef>;

export default function Index() {
  const sectionRefMap: SectionRefMap = {
    Home: {
      ref: React.useRef<HTMLElement>(),
      routerLayout: {
        routerPath: "/#home",
        labelRoute: "Home",
      },
      component: <Home />,
    },
    About: {
      ref: React.useRef<HTMLElement>(),
      routerLayout: {
        routerPath: "/#about",
        labelRoute: "About",
      },
      component: <About />,
    },
    Catalogue: {
      ref: React.useRef<HTMLElement>(),
      routerLayout: {
        routerPath: "/#catalogue",
        labelRoute: "Catalogue",
      },
      component: <Catalogue />,
    },
  };

  const sectionRefArr = Object.keys(sectionRefMap).map((k) => sectionRefMap[k]);
  const routers = sectionRefArr.map((s) => s.routerLayout);

  return (
    <Layout routers={routers}>
      <FullpageVerticalHashRoute
        autoScroll={true}
        sectionRouteRefArr={sectionRefArr.map((s) => ({
          routerPath: s.routerLayout.routerPath,
          ...s,
        }))}
      />
    </Layout>
    // <Layout routers={routers}>
    //   <FullpageHorizontalHashRoute
    //     autoScroll={true}
    //     sectionRouteRefArr={sectionRefArr.map((s) => ({
    //       routerPath: s.routerLayout.routerPath,
    //       ...s,
    //     }))}
    //   />
    // </Layout>
  );
}
