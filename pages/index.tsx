import Home from "./home";
import React from "react";
import { useRouter } from "next/dist/client/router";
import Layout, { RouterLayout } from "../components/layout";
import About from "./about";
import { difference } from "lodash";

type SectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  routerLayout: RouterLayout;
  component: JSX.Element;
};

type SectionRefMap = Record<string, SectionRef>;

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

  // const [muteOnScrollState, setMuteOnScrollState] = React.useState<boolean>(
  //   false
  // );
  const muteOnScrollRef = React.useRef<boolean>(false);
  const sectionIdxRef = React.useRef<number>(0);

  const onFinishedScroll = () => {
    // setMuteOnScrollState(false);
    muteOnScrollRef.current = false;
  };

  const onStartScroll = () => {
    // setMuteOnScrollState(true);
    muteOnScrollRef.current = true;
  };

  React.useEffect(() => {
    const onHashchange = () => {
      const idx = sectionRefArr.findIndex(
        (s) => s.routerLayout.routerPath == "/" + window.location.hash
      );
      if (idx < 0) {
        console.error("Hash Link not found");
        sectionIdxRef.current = 0;
      } else {
        sectionIdxRef.current = idx;
      }

      const sectionRef = sectionRefArr[sectionIdxRef.current];
      window.location.hash = sectionRef.routerLayout.routerPath.substring(2);
      scrollToSection({
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
    <Layout routers={routers}>
      <div
        className="Main"
        ref={mainRef}
        onScroll={(e) => {
          if (muteOnScrollRef.current) return;
          const x = sectionRefArr.reduce((p, c) => {
            const c_diff = Math.abs(
              mainRef.current.scrollTop - c.ref.current.offsetTop
            );
            const p_diff = Math.abs(
              mainRef.current.scrollTop - p.ref.current.offsetTop
            );
            console.log(
              p.routerLayout.routerPath,
              c.routerLayout.routerPath,
              c_diff,
              p_diff
            );
            if (c_diff < p_diff) return c;
            else return p;
          });
          window.location.hash = x.routerLayout.routerPath.substring(2);
        }}
      >
        {sectionRefArr.map((s) => (
          <section
            ref={s.ref}
            key={s.routerLayout.routerPath}
            className="section"
          >
            {s.component}
          </section>
        ))}
      </div>
    </Layout>
  );
}

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  sectionRef: SectionRef;
  scrolledRefEl: React.MutableRefObject<HTMLElement>;
  onStart?: () => void;
  onFinished?: () => void;
}) => {
  const { sectionRef, scrolledRefEl, onFinished, onStart } = params;

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
