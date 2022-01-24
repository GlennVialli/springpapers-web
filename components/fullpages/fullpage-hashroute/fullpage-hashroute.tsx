import React from "react";
import { useFullPage } from "../../../hooks/fullpage_hooks/useFullPage";
import { useOnScrollFullpageWhenPercentView } from "../../../hooks/fullpage_hooks/useOnScrollFullpageWhenPercentView";
import { useHashRoute } from "../../../hooks/useHashRoute";
import { OrientationType } from "../direction-utils";
import { inOutSine } from "../ease-utils";

type RouterPath = `/#${string}`;

type FullpageBaseRef = {
  component: JSX.Element;
};
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
  const FullPageHook = useFullPage();
  const {
    FullpageBase,
    FullpageSection,
    fullpageBaseProps,
    getCurrentSectionIndex,
    goToSectionByIndex,
    setDisableSectionScroll,
  } = FullPageHook;
  const onScrollFullpageWhenPercentView =
    useOnScrollFullpageWhenPercentView(FullPageHook);
  const [hashRoute, setHashRoute] = useHashRoute();
  const mainRef = React.useRef<HTMLDivElement>();
  const sectionRefs = React.useRef<HTMLElement[]>(
    Array(sectionRouteRefArr.length)
  );

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

  return (
    <FullpageBase
      {...fullpageBaseProps}
      orientation={orientation}
      onScrollFullpage={(o) => {
        onScrollFullpageWhenPercentView(o);
      }}
      scrollDuration={scrollDuration ? scrollDuration : 2500}
      scrollEase={scrollEase ? scrollEase : inOutSine}
      ref={mainRef}
      onMouseUp={() => {
        if (autoScroll === false) {
          setDisableSectionScroll(false);
        }
      }}
      onTouchStart={() => {
        if (autoScroll === false) {
          setDisableSectionScroll(false);
        }
      }}
      onMouseDown={() => {
        if (autoScroll === false) {
          setDisableSectionScroll(true);
        }
      }}
      onTouchEnd={() => {
        if (autoScroll === false) {
          setDisableSectionScroll(true);
        }
      }}
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
