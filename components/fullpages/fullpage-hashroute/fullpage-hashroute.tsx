import React from "react";
import { useHashRoute } from "../../../hooks/useHashRoute";
import { DirectionType, directionSetterValue } from "../direction-utils";
import { FullpageBase, FullpageBaseRef } from "../fullpage-base/fullpage-base";

type RouterPath = `/#${string}`;

type FullpageRouterSectionRef = FullpageBaseRef & {
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageRouterSectionRef[];
  autoScroll: boolean;
  direction: DirectionType;
};

export const FullpageHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
  direction,
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
        directionSetterValue({
          horizontalValue:
            event.currentTarget.scrollLeft - c.current.offsetLeft,
          verticalValue: event.currentTarget.scrollTop - c.current.offsetTop,
          direction,
        })
      );
      const p_diff = Math.abs(
        directionSetterValue({
          horizontalValue:
            event.currentTarget.scrollLeft - p.current.offsetLeft,
          verticalValue: event.currentTarget.scrollTop - p.current.offsetTop,
          direction,
        })
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
    <FullpageBase
      sectionRefArr={sectionRefArr.current}
      selectedSection={sectionRefArr.current[refIdx]}
      onLoadSectionRefs={setSectionRefs}
      onStartSectionScroll={() => {
        muteOnScrollRef.current = true;
        directionSetterValue({
          direction,
          horizontalValue: () => (mainRef.current.style.overflowX = "hidden"),
          verticalValue: () => (mainRef.current.style.overflowY = "hidden"),
        })();
      }}
      onFinishedSectionScroll={() => {
        muteOnScrollRef.current = false;
        directionSetterValue({
          direction,
          horizontalValue: () => (mainRef.current.style.overflowX = "scroll"),
          verticalValue: () => (mainRef.current.style.overflowY = "scroll"),
        })();
      }}
      onScroll={onScrollMain}
      disableSectionScroll={disableSectionScroll}
      direction={direction}
      ref={mainRef}
    />
  );
};
