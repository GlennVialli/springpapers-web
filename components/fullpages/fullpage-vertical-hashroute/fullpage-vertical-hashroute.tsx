import React from "react";
import { FullpageVertical } from "../fullpage-vertical/fullpage-vertical";
import { useHashRoute } from "../../../hooks/useHashRoute";

type RouterPath = `/#${string}`;

type FullpageVerticalHashRouteRef = {
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageVerticalHashRouteRef[];
  autoScroll: boolean;
};

const FullpageVerticalHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
}) => {
  const [hashRoute, setHashRoute] = useHashRoute();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const mainRef = React.useRef<HTMLDivElement>();
  const [sectionRefs, setSectionRefs] = React.useState<
    React.RefObject<HTMLElement>[]
  >([]);
  const sectionRefArr = React.useRef(
    sectionRouteRefArr.map((s) => ({
      component: s.component,
    }))
  );
  const [refIdx, setRefIdx] = React.useState(0);
  const [disableSectionScroll, setDisableSectionScroll] = React.useState(false);
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
        event.currentTarget.scrollTop - c.current.offsetTop
      );
      const p_diff = Math.abs(
        event.currentTarget.scrollTop - p.current.offsetTop
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    if (autoScroll === false && disableSectionScroll === false) {
      setDisableSectionScroll(true);
    }

    if (scrollTimeRef.current) clearTimeout(scrollTimeRef.current);
    scrollTimeRef.current = setTimeout(() => {
      scrollTimeRef.current = undefined;
      if (disableSectionScroll) {
        setDisableSectionScroll(false);
      }
    }, 1000);

    const index = sectionRefs.findIndex((s) => s == x);
    setHashRoute(sectionRouteRefArr[index].routerPath);
  };

  return (
    <FullpageVertical
      sectionRefArr={sectionRefArr.current}
      selectedSection={sectionRefArr.current[refIdx]}
      onSectionRefs={setSectionRefs}
      onStartSectionScroll={() => {
        muteOnScrollRef.current = true;
        mainRef.current.style.overflowY = "hidden";
      }}
      onFinishedSectionScroll={() => {
        muteOnScrollRef.current = false;
        mainRef.current.style.overflowY = "scroll";
      }}
      onScroll={onScrollMain}
      ref={mainRef}
      disableSectionScroll={disableSectionScroll}
    />
  );
};

export default FullpageVerticalHashRoute;
