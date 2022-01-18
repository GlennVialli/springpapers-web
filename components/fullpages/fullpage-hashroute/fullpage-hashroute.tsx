import React from "react";
import { useFullPage, OnScrollFullpage } from "../../../hooks/useFullPage";
import { useHashRoute } from "../../../hooks/useHashRoute";
import { OrientationType, orientationSetterValue } from "../direction-utils";
import { inOutSine } from "../ease-utils";
import { FullpageBase, FullpageBaseRef } from "../fullpage-base/fullpage-base";

type RouterPath = `/#${string}`;

type FullpageRouterSectionRef = FullpageBaseRef & {
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageRouterSectionRef[];
  autoScroll: boolean;
  orientation: OrientationType;
  scrollDuration?: number;
  scrollEase?: (time: number) => number;
};

export const FullpageHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
  orientation,
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

      if (autoScroll === false && disableSectionScroll === false) {
        setDisableSectionScroll(true);
      }
      const currentIndex = getCurrentSectionIndex();
      const index =
        currentIndex +
        (() => {
          if (scrollDirection === "right" || scrollDirection === "down")
            return 1;
          if (scrollDirection === "left" || scrollDirection === "up") return -1;
        })();
      const nextSection = sectionRefs.current[index];
      if (!nextSection) return;

      const percentageView = (() => {
        const percent = 50;
        if (scrollDirection === "right" || scrollDirection === "left")
          return (nextSection.offsetWidth * percent) / 100;
        if (scrollDirection === "up" || scrollDirection === "down")
          return (nextSection.offsetHeight * percent) / 100;
      })();
      let go = false;

      if (
        scrollDirection === "right" &&
        Math.abs(
          event.currentTarget.scrollLeft -
            nextSection.offsetLeft +
            nextSection.offsetWidth
        ) > percentageView
      ) {
        go = true;
      }

      if (
        scrollDirection === "left" &&
        Math.abs(
          event.currentTarget.scrollLeft -
            nextSection.offsetLeft -
            nextSection.offsetWidth
        ) > percentageView
      ) {
        go = true;
      }

      if (
        scrollDirection === "down" &&
        Math.abs(
          event.currentTarget.scrollTop -
            nextSection.offsetTop +
            nextSection.offsetHeight
        ) > percentageView
      ) {
        go = true;
      }

      if (
        scrollDirection === "up" &&
        Math.abs(
          event.currentTarget.scrollTop -
            nextSection.offsetTop -
            nextSection.offsetHeight
        ) > percentageView
      ) {
        go = true;
      }

      if (!go) return;
      if (sectionRouteRefArr[index]?.routerPath)
        setHashRoute(sectionRouteRefArr[index].routerPath);
    },
    [
      sectionRefs.current,
      getCurrentSectionIndex,
      autoScroll,
      disableSectionScroll,
    ]
  );

  return (
    <FullpageBase
      {...fullpageBaseProps}
      orientation={orientation}
      onStartSectionScroll={() => {
        muteOnScrollRef.current = true;
        orientationSetterValue({
          orientation,
          horizontalValue: () => (mainRef.current.style.overflowX = "hidden"),
          verticalValue: () => (mainRef.current.style.overflowY = "hidden"),
        })();
      }}
      onFinishedSectionScroll={() => {
        muteOnScrollRef.current = false;
        orientationSetterValue({
          orientation,
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
