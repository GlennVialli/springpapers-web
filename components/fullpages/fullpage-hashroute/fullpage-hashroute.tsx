import React from "react";
import {
  useFullPage,
  OnScrollFullpage,
} from "../../../hooks/fullpage_hooks/useFullPage";
import { useOnScrollFullpageWhenPercentView } from "../../../hooks/fullpage_hooks/useOnScrollFullpageWhenPercentView";
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
  const muteOnScrollRef = React.useRef<boolean>(false);
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

  const onScrollMain = React.useCallback<OnScrollFullpage>(
    (o) => {},
    [
      sectionRefs.current,
      getCurrentSectionIndex,
      autoScroll,
      fullpageBaseProps.disableSectionScroll,
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
      onScrollFullpage={(o) => {
        if (muteOnScrollRef.current) return;
        if (
          autoScroll === false &&
          fullpageBaseProps.disableSectionScroll === false
        ) {
          setDisableSectionScroll(true);
        }
        onScrollFullpageWhenPercentView(o);
      }}
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
