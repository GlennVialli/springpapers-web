import { useRouter } from "next/dist/client/router";
import React from "react";
import { FullpageHorizontal } from "../fullpage-horizontal/fullpage-horizontal";

type RouterPath = `/#${string}`;

type FullpageHorizontalRouterSectionRef = {
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageHorizontalRouterSectionRef[];
  autoScroll: boolean;
};

const FullpageHorizontalHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
}) => {
  const Router = useRouter();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const mainRef = React.useRef<HTMLDivElement>();
  const [sectionRefs, setSectionRefs] = React.useState<
    React.RefObject<HTMLElement>[]
  >();
  const [sectionRefArr, setSectionRefArr] = React.useState([]);
  const [refIdx, setRefIdx] = React.useState<number>(0);

  React.useEffect(() => {
    window.onhashchange = onHashChange;
  }, []);

  React.useEffect(() => {
    setSectionRefArr(
      sectionRouteRefArr.map((s) => ({
        component: s.component,
      }))
    );
  }, [sectionRouteRefArr]);

  React.useEffect(() => {
    const routerPath = Router.asPath;
    if (routerPath === "/" && sectionRouteRefArr[0]) {
      window.location.hash = sectionRouteRefArr[0].routerPath.substring(2);
    }

    window.onhashchange = onHashChange;
    window.location.hash = routerPath.substring(2);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [Router]);

  React.useEffect(() => {
    const sectionRef = sectionRouteRefArr[refIdx];
    window.location.hash = sectionRef.routerPath.substring(2);
  }, [refIdx]);

  const onHashChange = () => {
    const idx = sectionRouteRefArr.findIndex(
      (s) => s.routerPath == "/" + window.location.hash
    );
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      setRefIdx(0);
    } else {
      setRefIdx(idx);
    }
  };

  const onScrollMain = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (muteOnScrollRef.current) return;
    const x = sectionRefs.reduce((p, c) => {
      const c_diff = Math.abs(
        event.currentTarget.scrollLeft - c.current.offsetLeft
      );
      const p_diff = Math.abs(
        event.currentTarget.scrollLeft - p.current.offsetLeft
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    if (autoScroll === false) {
      window.onhashchange = function () {
        window.onhashchange = onHashChange;
      };
    }
    const index = sectionRefs.findIndex((s) => s == x);
    window.location.hash = sectionRouteRefArr[index].routerPath.substring(2);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <FullpageHorizontal
      sectionRefArr={sectionRefArr}
      selectedSection={sectionRefArr[refIdx]}
      onSectionRefs={setSectionRefs}
      onStartSectionScroll={() => {
        muteOnScrollRef.current = true;
        mainRef.current.style.overflowX = "hidden";
      }}
      onFinishedSectionScroll={() => {
        muteOnScrollRef.current = false;
        mainRef.current.style.overflowX = "scroll";
      }}
      onScroll={onScrollMain}
      ref={mainRef}
    />
  );
};

export default FullpageHorizontalHashRoute;
