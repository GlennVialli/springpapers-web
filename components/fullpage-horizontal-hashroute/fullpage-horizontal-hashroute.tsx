import { useRouter } from "next/dist/client/router";
import React from "react";
import styles from "./fullpage-horizontal-hashroute.module.scss";

type RouterPath = `/#${string}`;

type FullpageHorizontalSectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRefArr: FullpageHorizontalSectionRef[];
  autoScroll: boolean;
};

const FullpageHorizontalHashRoute: React.FC<Props> = ({
  sectionRefArr,
  autoScroll,
}) => {
  const mainRef = React.useRef<HTMLDivElement>();
  const { onScrollMain } = useFullpageHorizontal({
    sectionRefArr,
    mainRef,
    autoScroll,
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
const useFullpageHorizontal = (params: {
  sectionRefArr: FullpageHorizontalSectionRef[];
  mainRef: React.MutableRefObject<HTMLDivElement>;
  autoScroll: boolean;
}) => {
  const { sectionRefArr, mainRef, autoScroll } = params;
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
    mainRef.current.style.overflowX = "scroll";
  };

  const onStartScroll = () => {
    muteOnScrollRef.current = true;
    mainRef.current.style.overflowX = "hidden";
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
        mainRef.current.scrollLeft - c.ref.current.offsetLeft
      );
      const p_diff = Math.abs(
        mainRef.current.scrollLeft - p.ref.current.offsetLeft
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

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  sectionRef: FullpageHorizontalSectionRef;
  scrolledRefEl?: HTMLElement;
  onStart?: () => void;
  onFinished?: () => void;
}) => {
  const { sectionRef, scrolledRefEl, onFinished, onStart } = params;

  const position = sectionRef.ref.current.offsetLeft;
  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;

    if (target.scrollLeft === position) {
      onFinished ? onFinished() : {};
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (scrolledRefEl && scrolledRefEl.scrollLeft !== position) {
    onStart ? onStart() : {};
  } else if (!scrolledRefEl && window.screenLeft !== position) {
    onStart ? onStart() : {};
  }

  if (scrolledRefEl) {
    scrolledRefEl.addEventListener("scroll", scrollListener);
    scrolledRefEl.scrollTo({
      behavior: "smooth",
      left: position,
    });
  } else {
    window.addEventListener("scroll", scrollListener);
    window.scrollTo({
      behavior: "smooth",
      left: position,
    });
  }
};

export default FullpageHorizontalHashRoute;
