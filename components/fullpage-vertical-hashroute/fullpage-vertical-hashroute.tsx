import React from "react";
import styles from "./fullpage-vertical-hashroute.module.scss";
import { useRouter } from "next/dist/client/router";

type RouterPath = `/#${string}`;

type FullpageVerticalHashRouteRef = {
  ref: React.MutableRefObject<HTMLElement>;
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRefArr: FullpageVerticalHashRouteRef[];
  autoScroll: boolean;
};

const FullpageVerticalHashRoute: React.FC<Props> = ({
  sectionRefArr,
  autoScroll,
}) => {
  const mainRef = React.useRef<HTMLDivElement>();
  const { onScrollMain } = useFullpageVertical({
    autoScroll,
    sectionRefArr,
    mainRef,
  });

  return (
    <div className={styles.Main} ref={mainRef} onScroll={onScrollMain}>
      {sectionRefArr.map((s) => (
        <section ref={s.ref} key={s.routerPath} className={styles.section}>
          {s.component}
        </section>
      ))}
    </div>
  );
};

// HOOKS
const useFullpageVertical = (params: {
  sectionRefArr: FullpageVerticalHashRouteRef[];
  autoScroll: boolean;
  mainRef: React.MutableRefObject<HTMLDivElement>;
}) => {
  const { sectionRefArr, autoScroll, mainRef } = params;

  const Router = useRouter();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const sectionIdxRef = React.useRef<number>(0);

  React.useEffect(() => {
    window.onhashchange = onHashChange;
  }, []);

  React.useEffect(() => {
    const routerPath = Router.asPath;
    if (routerPath === "/" && sectionRefArr[0]) {
      window.location.hash = sectionRefArr[0].routerPath.substring(2);
    }

    window.onhashchange = onHashChange;
    window.location.hash = routerPath.substring(2);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [Router]);

  const onFinishedScroll = () => {
    muteOnScrollRef.current = false;
    mainRef.current.style.overflowY = "scroll";
  };

  const onStartScroll = () => {
    muteOnScrollRef.current = true;
    mainRef.current.style.overflowY = "hidden";
  };

  const onHashChange = () => {
    const idx = sectionRefArr.findIndex(
      (s) => s.routerPath == "/" + window.location.hash
    );
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      sectionIdxRef.current = 0;
    } else {
      sectionIdxRef.current = idx;
    }

    const sectionRef = sectionRefArr[sectionIdxRef.current];
    window.location.hash = sectionRef.routerPath.substring(2);
    scrollToSection({
      sectionRef,
      scrolledRefEl: mainRef.current,
      onStart: onStartScroll,
      onFinished: onFinishedScroll,
    });
  };

  const onScrollMain = () => {
    if (muteOnScrollRef.current) return;
    const x = sectionRefArr.reduce((p, c) => {
      const c_diff = Math.abs(
        mainRef.current.scrollTop - c.ref.current.offsetTop
      );
      const p_diff = Math.abs(
        mainRef.current.scrollTop - p.ref.current.offsetTop
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    if (autoScroll === false) {
      window.onhashchange = function () {
        window.onhashchange = onHashChange;
      };
    }

    window.location.hash = x.routerPath.substring(2);
  };

  return { onScrollMain };
};
// END OF HOOKS

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  sectionRef: FullpageVerticalHashRouteRef;
  scrolledRefEl?: HTMLElement;
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

  if (scrolledRefEl && scrolledRefEl.scrollTop !== position) {
    onStart ? onStart() : {};
  } else if (!scrolledRefEl && window.screenTop !== position) {
    onStart ? onStart() : {};
  }

  if (scrolledRefEl) {
    scrolledRefEl.addEventListener("scroll", scrollListener);
    scrolledRefEl.scrollTo({
      behavior: "smooth",
      top: position,
    });
  } else {
    window.addEventListener("scroll", scrollListener);
    window.scrollTo({
      behavior: "smooth",
      top: position,
    });
  }
};

export default FullpageVerticalHashRoute;