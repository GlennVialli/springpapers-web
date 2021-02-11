import React from "react";
import { useRouter } from "next/dist/client/router";

type RouterPath = `/#${string}`;

type FullpageVerticalSectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRefArr: FullpageVerticalSectionRef[];
  autoScroll: boolean;
};

const FullpageVertical: React.FC<Props> = ({ sectionRefArr, autoScroll }) => {
  const mainRef = React.useRef<HTMLDivElement>();
  const { onScrollMain } = useFullpageVertical({
    autoScroll,
    sectionRefArr,
    mainRef: mainRef.current,
  });

  return (
    <div className="Main" ref={mainRef} onScroll={onScrollMain}>
      {sectionRefArr.map((s) => (
        <section ref={s.ref} key={s.routerPath} className="section">
          {s.component}
        </section>
      ))}
    </div>
  );
};

// HOOKS
const useFullpageVertical = (params: {
  sectionRefArr: FullpageVerticalSectionRef[];
  autoScroll: boolean;
  mainRef: HTMLDivElement;
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
    mainRef.style.overflowY = "scroll";
  };

  const onStartScroll = () => {
    muteOnScrollRef.current = true;
    mainRef.style.overflowY = "hidden";
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
      scrolledRefEl: mainRef,
      onStart: onStartScroll,
      onFinished: onFinishedScroll,
    });
  };

  const onScrollMain = () => {
    if (muteOnScrollRef.current) return;
    const x = sectionRefArr.reduce((p, c) => {
      const c_diff = Math.abs(mainRef.scrollTop - c.ref.current.offsetTop);
      const p_diff = Math.abs(mainRef.scrollTop - p.ref.current.offsetTop);
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
  sectionRef: FullpageVerticalSectionRef;
  scrolledRefEl?: HTMLElement;
  onStart?: () => void;
  onFinished?: () => void;
}) => {
  const { sectionRef, scrolledRefEl, onFinished, onStart } = params;
  if (!scrolledRefEl) return;

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

  if (scrolledRefEl.scrollTop !== position) {
    onStart ? onStart() : {};
  }
  scrolledRefEl.addEventListener("scroll", scrollListener);
  scrolledRefEl.scrollTo({
    behavior: "smooth",
    top: position,
  });
};

export default FullpageVertical;
