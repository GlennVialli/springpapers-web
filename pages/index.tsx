import Home from "./home";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout, { RouterLayout } from "../components/layout";
import About from "./about";

type SectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  routerLayout: RouterLayout;
  component: JSX.Element;
};

type SectionRefMap = Record<string, SectionRef>;
let oldScroll = 0;

export default function Index() {
  const Router = useRouter();
  const mainRef = React.useRef<HTMLDivElement>();
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
  };

  const sectionRefArr = Object.keys(sectionRefMap).map((k) => sectionRefMap[k]);
  const routers = sectionRefArr.map((s) => s.routerLayout);

  const [muteOnScrollState, setMuteOnScrollState] = React.useState<boolean>(
    false
  );

  const onFinishedScroll = () => {
    setMuteOnScrollState(false);
  };

  const onStartScroll = () => {
    setMuteOnScrollState(true);
  };

  React.useEffect(() => {
    const onHashchange = () => {
      const sectionRef = getSectionRef(sectionRefArr);
      window.location.hash = sectionRef.routerLayout.routerPath.substring(2);
      scrollToSection({
        routerPath: "/" + window.location.hash,
        sectionRef,
        scrolledRefEl: mainRef,
        onStart: onStartScroll,
        onFinished: onFinishedScroll,
      });
    };
    window.addEventListener("hashchange", onHashchange);
  }, []);

  React.useEffect(() => {
    const routerPath = Router.asPath;
    if (routerPath === "/" && sectionRefArr[0]) {
      window.location.hash = sectionRefArr[0].routerLayout.routerPath.substring(
        2
      );
    }
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [Router]);

  return (
    <div
      className="Main"
      ref={mainRef}
      onScroll={() => {
        if (muteOnScrollState) return;
        if (mainRef.current.scrollTop > oldScroll) {
          //scroll down
          console.log("down");
        } else {
          //scroll up
          console.log("up");
        }
        oldScroll = mainRef.current.scrollTop;
      }}
    >
      <Layout routers={routers}>
        {sectionRefArr.map((s) => (
          <section
            ref={s.ref}
            key={s.routerLayout.routerPath}
            className="section"
          >
            {s.component}
          </section>
        ))}
      </Layout>
    </div>
  );
}

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  routerPath: string;
  sectionRef: SectionRef;
  scrolledRefEl: React.MutableRefObject<HTMLElement>;
  onStart?: () => void;
  onFinished?: () => void;
}) => {
  const { routerPath, sectionRef, scrolledRefEl, onFinished, onStart } = params;

  const position = sectionRef.ref.current.offsetTop - 100;
  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;

    if (target.scrollTop === position) {
      onFinished ? onFinished() : {};
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (scrolledRefEl.current.scrollTop !== position) {
    onStart ? onStart() : {};
  }
  scrolledRefEl.current.addEventListener("scroll", scrollListener);
  scrolledRefEl.current.scrollTo({
    behavior: "smooth",
    top: position,
  });
};

const getSectionRef = (sectionRefArr: SectionRef[]) => {
  const sectionRefIdx = sectionRefArr.findIndex(
    (s) => s.routerLayout.routerPath == "/" + window.location.hash
  );
  if (sectionRefIdx < 0) {
    console.error("Hash Link not found");
    return sectionRefArr[0];
  }
  return sectionRefArr[sectionRefIdx];
};
