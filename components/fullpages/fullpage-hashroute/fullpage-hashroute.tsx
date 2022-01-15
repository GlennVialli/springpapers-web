import React from "react";
import { useFullPage, OnScrollFullpage } from "../../../hooks/useFullPage";
import { useHashRoute } from "../../../hooks/useHashRoute";
import { DirectionType, directionSetterValue } from "../direction-utils";
import { inOutSine } from "../ease-utils";
import { FullpageBase, FullpageBaseRef } from "../fullpage-base/fullpage-base";

type RouterPath = `/#${string}`;

type FullpageRouterSectionRef = FullpageBaseRef & {
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageRouterSectionRef[];
  autoScroll: boolean;
  direction: DirectionType;
  scrollDuration?: number;
  scrollEase?: (time: number) => number;
};

export const FullpageHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
  direction,
  scrollDuration,
  scrollEase,
}) => {
  const {
    FullpageBase,
    FullpageSection,
    fullpageBaseProps,
    getCurrentSectionIndex,
    goToSectionByIndex,
  } = useFullPage();
  const [hashRoute, setHashRoute] = useHashRoute();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const mainRef = React.useRef<HTMLDivElement>();
  const sectionRefs = React.useRef<HTMLElement[]>(
    Array(sectionRouteRefArr.length)
  );

  const [disableSectionScroll, setDisableSectionScroll] = React.useState(false);

  React.useEffect(() => {
    const sectionRef = sectionRouteRefArr[fullpageBaseProps.selectedIndex];
    window.location.hash = sectionRef.routerPath.substring(2);
  }, [fullpageBaseProps.selectedIndex]);

  React.useEffect(() => {
    const idx = sectionRouteRefArr.findIndex((s) => s.routerPath == hashRoute);
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      goToSectionByIndex(0);
    } else {
      goToSectionByIndex(idx);
    }
  }, [hashRoute]);

  const onScrollMain = React.useCallback<OnScrollFullpage>(
    (o) => {
      const { event, scrollDirection } = o;
      if (muteOnScrollRef.current) return;
      const x = sectionRefs.current.reduce((p, c) => {
        const c_diff = Math.abs(
          directionSetterValue({
            horizontalValue: event.currentTarget.scrollLeft - c.offsetLeft,
            verticalValue: event.currentTarget.scrollTop - c.offsetTop,
            direction,
          })
        );
        const p_diff = Math.abs(
          directionSetterValue({
            horizontalValue: event.currentTarget.scrollLeft - p.offsetLeft,
            verticalValue: event.currentTarget.scrollTop - p.offsetTop,
            direction,
          })
        );
        if (c_diff < p_diff) return c;
        else return p;
      });
      if (autoScroll === false && disableSectionScroll === false) {
        setDisableSectionScroll(true);
      }

      const index = sectionRefs.current.findIndex((s) => s == x);
      if (sectionRouteRefArr[index]?.routerPath)
        setHashRoute(sectionRouteRefArr[index].routerPath);
    },
    [sectionRefs.current]
  );

  return (
    <FullpageBase
      {...fullpageBaseProps}
      direction={direction}
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
        setDisableSectionScroll(false);
      }}
      onScrollFullpage={onScrollMain}
      disableSectionScroll={disableSectionScroll}
      scrollDuration={scrollDuration ? scrollDuration : 2500}
      scrollEase={scrollEase ? scrollEase : inOutSine}
      ref={mainRef}
    >
      {sectionRouteRefArr.map((s, i) => (
        <FullpageSection
          ref={(r) => {
            sectionRefs.current[i] = r;
          }}
          key={i}
        >
          {s.component}
        </FullpageSection>
      ))}
    </FullpageBase>
  );
};
