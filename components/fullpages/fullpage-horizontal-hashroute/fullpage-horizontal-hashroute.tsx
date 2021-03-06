import React from "react";
import { useHashRoute } from "../../../hooks/useHashRoute";
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
  const [hashRoute, setHashRoute] = useHashRoute();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const mainRef = React.useRef<HTMLDivElement>();
  const [sectionRefs, setSectionRefs] = React.useState<
    React.RefObject<HTMLElement>[]
  >();

  const sectionRefArr = React.useRef(
    sectionRouteRefArr.map((s) => ({
      component: s.component,
    }))
  );
  const [refIdx, setRefIdx] = React.useState<number>(0);
  const [disableScroll, setDisableScroll] = React.useState(false);
  const scrollTimeRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    const sectionRef = sectionRouteRefArr[refIdx];
    window.location.hash = sectionRef.routerPath.substring(2);
  }, [refIdx]);

  React.useEffect(() => {
    const idx = sectionRouteRefArr.findIndex((s) => s.routerPath == hashRoute);
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      setRefIdx(0);
    } else {
      setRefIdx(idx);
    }
  }, [hashRoute]);

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
    if (autoScroll === false && disableScroll === false) {
      setDisableScroll(true);
    }

    if (scrollTimeRef.current) clearTimeout(scrollTimeRef.current);
    scrollTimeRef.current = setTimeout(() => {
      scrollTimeRef.current = undefined;
      if (disableScroll) {
        setDisableScroll(false);
      }
    }, 1000);

    const index = sectionRefs.findIndex((s) => s == x);
    setHashRoute(sectionRouteRefArr[index].routerPath);
  };

  return (
    <FullpageHorizontal
      sectionRefArr={sectionRefArr.current}
      selectedSection={sectionRefArr.current[refIdx]}
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
      disableScroll={disableScroll}
      ref={mainRef}
    />
  );
};

export default FullpageHorizontalHashRoute;
