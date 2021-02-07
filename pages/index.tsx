import Home from "./home";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/layout";
import About from "./about";

type RouterPath = `/#${string}`;
type SectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  routerPath: RouterPath;
};

type SectionRefMap = Record<string, SectionRef>;

export default function Index() {
  const Router = useRouter();
  const mainRef = React.useRef<HTMLDivElement>();
  const sectionRefMap: SectionRefMap = {
    Home: {
      ref: React.useRef<HTMLElement>(),
      routerPath: "/#home",
    },
    About: {
      ref: React.useRef<HTMLElement>(),
      routerPath: "/#about",
    },
  };

  const sectionRefArr = Object.keys(sectionRefMap).map((k) => sectionRefMap[k]);

  React.useEffect(() => {
    window.addEventListener("hashchange", (e) => {
      foo({
        routerPath: "/" + window.location.hash,
        sectionRefArr,
        scrolledRefEl: mainRef,
      });
    });
  }, []);

  React.useEffect(() => {
    const routerPath = Router.asPath;
    foo({ routerPath, sectionRefArr, scrolledRefEl: mainRef });
  }, [Router]);

  return (
    <div className="Main" ref={mainRef}>
      <Layout>
        <section ref={sectionRefMap.Home.ref} className="section">
          <Home />
        </section>
        <section ref={sectionRefMap.About.ref} className="section">
          <About />
        </section>
      </Layout>
    </div>
  );
}

const foo = (params: {
  routerPath: string;
  sectionRefArr: SectionRef[];
  scrolledRefEl: React.MutableRefObject<HTMLElement>;
}) => {
  const { routerPath, sectionRefArr, scrolledRefEl } = params;
  const sectionRefIdx = sectionRefArr.findIndex(
    (s) => s.routerPath == routerPath
  );
  if (sectionRefIdx >= 0) {
    // i will show the modal
    scrolledRefEl.current.scrollTo({
      behavior: "smooth",
      top: sectionRefArr[sectionRefIdx].ref.current.offsetTop - 100,
    });
  } else {
    // something else
  }
};
