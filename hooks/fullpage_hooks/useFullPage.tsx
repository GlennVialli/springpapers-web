import React from "react";
import styles from "./fullpageBase.module.scss";
import {
  orientationSetterValue,
  OrientationType,
} from "../../components/fullpages/direction-utils";
import { inOutSine } from "../../components/fullpages/ease-utils";
import Scroll from "scroll";

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  destinationRef: HTMLElement;
  scrolledRefEl: HTMLElement;
  onStart?: () => void;
  onFinished?: () => void;
  offsetAdjustment?: number;
  scrollDuration: number;
  scrollEase: (time: number) => number;
  orientation: "horizontal" | "vertical";
  maxOffset: number;
}) => {
  const offsetAdjustment = params.offsetAdjustment
    ? params.offsetAdjustment
    : 0;

  const offset = orientationSetterValue({
    horizontalValue: params.destinationRef.offsetLeft,
    verticalValue: params.destinationRef.offsetTop,
    orientation: params.orientation,
  })!;

  const position = offset + offsetAdjustment;

  var timer = null;
  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      params.onFinished?.();
      params.scrolledRefEl.removeEventListener("scroll", scrollListener);
    }, 150);
  };

  if (
    orientationSetterValue({
      horizontalValue:
        params.scrolledRefEl && params.scrolledRefEl.scrollLeft !== position,
      verticalValue:
        params.scrolledRefEl && params.scrolledRefEl.scrollTop !== position,
      orientation: params.orientation,
    })
  ) {
    params.onStart?.();
  }

  params.scrolledRefEl.addEventListener("scroll", scrollListener);

  orientationSetterValue({
    orientation: params.orientation,
    horizontalValue: Scroll.left(params.scrolledRefEl, position, {
      duration: params.scrollDuration,
      ease: params.scrollEase,
    }),
    verticalValue: Scroll.top(params.scrolledRefEl, position, {
      duration: params.scrollDuration,
      ease: params.scrollEase,
    }),
  });
};

interface PropsFullpageSection {}
const FullpageSection = React.forwardRef<
  HTMLElement,
  PropsFullpageSection & React.HTMLProps<HTMLElement>
>((params, ref: React.MutableRefObject<HTMLElement>) => {
  return (
    <section
      ref={ref}
      className={[styles.section, "fullpage-base-section"].join(" ")}
    >
      {params.children}
    </section>
  );
});

type ScrollPageDirection = "right" | "left" | "up" | "down";
export type OnScrollFullpage = (o: {
  event: React.UIEvent<HTMLDivElement, UIEvent>;
  scrollDirection: ScrollPageDirection;
}) => void;

type PropsFullpageBase = {
  orientation: OrientationType;
  selectedIndex?: number;
  disableSectionScroll?: boolean;
  scrollDuration?: number;
  maxOffset?: number;
  scrollEase?: (time: number) => number;
  onScrollFullpage?: OnScrollFullpage;
  onStartSectionScroll?: () => void;
  onFinishedSectionScroll?: () => void;
  onLoadSectionRefs: (refs: React.MutableRefObject<HTMLElement[]>) => void;
};

const FullpageBase = React.forwardRef<
  HTMLDivElement,
  PropsFullpageBase & React.HTMLProps<HTMLDivElement>
>((params, ref: React.MutableRefObject<HTMLDivElement>) => {
  const mainRef = React.useRef<HTMLDivElement>();
  const sectionRefs = React.useRef<HTMLElement[]>(
    Array(React.Children.toArray(params.children).length)
  );
  const muteOnScrollRef = React.useRef<boolean>(false);
  let lastScrollLeft = React.useRef(0).current;
  let lastScrollTop = React.useRef(0).current;

  React.useEffect(() => {
    if (ref) {
      ref.current = mainRef.current;
    }
    lastScrollLeft = mainRef.current.scrollLeft;
    lastScrollTop = mainRef.current.scrollTop;
  }, [mainRef, mainRef.current]);

  React.useEffect(() => {
    params.onLoadSectionRefs(sectionRefs);
  }, [sectionRefs, sectionRefs.current]);

  React.useEffect(() => {
    const idx = params.selectedIndex ?? 0;
    if (idx < 0) {
      console.error("section not found");
      return;
    }

    if (params.disableSectionScroll) return;
    if (!sectionRefs.current[0]) return;
    const offsetAdjustment = orientationSetterValue({
      horizontalValue: -sectionRefs.current[0].offsetLeft,
      verticalValue: -sectionRefs.current[0].offsetTop,
      orientation: params.orientation,
    });

    scrollToSection({
      destinationRef: sectionRefs.current[idx],
      scrolledRefEl: mainRef.current,
      onFinished: () => {
        muteOnScrollRef.current = false;
        orientationSetterValue({
          orientation: params.orientation,
          horizontalValue: () => (mainRef.current.style.overflowX = "scroll"),
          verticalValue: () => (mainRef.current.style.overflowY = "scroll"),
        })();
        params.onFinishedSectionScroll?.();
      },
      onStart: () => {
        muteOnScrollRef.current = true;
        orientationSetterValue({
          orientation: params.orientation,
          horizontalValue: () => (mainRef.current.style.overflowX = "hidden"),
          verticalValue: () => (mainRef.current.style.overflowY = "hidden"),
        })();
        params.onStartSectionScroll?.();
      },
      offsetAdjustment,
      orientation: params.orientation,
      scrollDuration: params.scrollDuration ?? 2500,
      scrollEase: params.scrollEase ?? inOutSine,
      maxOffset: params.maxOffset ?? 0,
    });
  }, [params.selectedIndex]);

  return (
    <div
      className={[
        styles.Main,
        "fullpage-base-container",
        styles[params.orientation],
      ].join(" ")}
      ref={mainRef}
      onScroll={(e) => {
        if (muteOnScrollRef.current) return;
        const scrollDirection = orientationSetterValue({
          orientation: params.orientation,
          horizontalValue:
            e.currentTarget.scrollLeft - lastScrollLeft > 0 ? "right" : "left",
          verticalValue:
            e.currentTarget.scrollTop - lastScrollTop > 0 ? "down" : "up",
        }) as ScrollPageDirection;
        lastScrollTop = e.currentTarget.scrollTop;
        lastScrollLeft = e.currentTarget.scrollLeft;
        params.onScrollFullpage?.({ event: e, scrollDirection });
      }}
      {...params}
    >
      {React.Children.toArray(params.children).map((s, index) => {
        const childEl = React.Children.only(s);
        return React.cloneElement(childEl as React.ReactElement<any>, {
          ref: (r) => {
            if ((s as any).ref) {
              if (typeof (s as any).ref === "function") (s as any).ref?.(r);
              else (s as any).ref.current = r;
            }
            sectionRefs.current[index] = r;
          },
        });
      })}
    </div>
  );
});

export const useFullPage = () => {
  const [selectedSectionIndex, setSelectedSectionIndex] =
    React.useState<number>(0);

  const [sectionRefs, setSectionRefs] =
    React.useState<React.MutableRefObject<HTMLElement[]>>();

  const [disableSectionScroll, setDisableSectionScroll] = React.useState(false);

  const goToSectionByIndex = React.useCallback(
    (index: number) => {
      setSelectedSectionIndex(index);
    },
    [setSelectedSectionIndex]
  );
  const getCurrentSectionIndex = React.useCallback(
    () => selectedSectionIndex,
    [selectedSectionIndex]
  );

  const getSectionRefs = React.useCallback(() => sectionRefs, [sectionRefs]);

  const fullpageBaseProps: PropsFullpageBase = {
    orientation: "horizontal",
    selectedIndex: selectedSectionIndex,
    onLoadSectionRefs: setSectionRefs,
    disableSectionScroll,
  };

  return {
    FullpageBase: FullpageBase,
    FullpageSection: FullpageSection,
    fullpageBaseProps,
    goToSectionByIndex,
    getCurrentSectionIndex,
    getSectionRefs,
    setDisableSectionScroll,
  };
};
