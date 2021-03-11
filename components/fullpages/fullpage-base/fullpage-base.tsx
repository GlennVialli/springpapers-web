import { dir } from "console";
import React from "react";
import { DirectionType, directionSetterValue } from "../direction-utils";
import styles from "./fullpage-base.module.scss";
import Scroll from "scroll";
import { inOutSine } from "../ease-utils";

export type FullpageBaseRef = {
  component: JSX.Element;
};

type Props = {
  sectionRefArr: FullpageBaseRef[];
  selectedSection: FullpageBaseRef;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onStartSectionScroll?: () => void;
  onFinishedSectionScroll?: () => void;
  onLoadSectionRefs?: (ref: React.RefObject<HTMLElement>[]) => void;
  disableSectionScroll?: boolean;
  scrollDuration?: number;
  scrollEase?: (time: number) => number;
  direction: DirectionType;
};

export const FullpageBase = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      sectionRefArr,
      selectedSection,
      onScroll,
      onStartSectionScroll,
      onFinishedSectionScroll,
      onLoadSectionRefs,
      disableSectionScroll,
      scrollDuration,
      scrollEase,
      direction,
    },
    ref: React.MutableRefObject<HTMLDivElement>
  ) => {
    const mainRef = React.useRef<HTMLDivElement>();
    const sectionRefs = React.useMemo(
      () => sectionRefArr.map(() => React.createRef<HTMLElement>()),
      [sectionRefArr]
    );
    React.useEffect(() => {
      ref.current = mainRef.current;
    }, [mainRef, mainRef.current]);

    React.useEffect(() => {
      if (onLoadSectionRefs) onLoadSectionRefs(sectionRefs);
    }, [sectionRefs]);

    React.useEffect(() => {
      const idx = sectionRefArr.findIndex((s) => s == selectedSection);
      if (idx < 0) {
        console.error("section not found");
        return;
      }

      if (disableSectionScroll) {
        onFinishedSectionScroll();
        return;
      }

      const offsetAdjustment = directionSetterValue({
        horizontalValue: -sectionRefs[0].current.offsetLeft,
        verticalValue: -sectionRefs[0].current.offsetTop,
        direction,
      });

      scrollToSection({
        destinationRef: sectionRefs[idx],
        scrolledRefEl: mainRef.current,
        onFinished: onFinishedSectionScroll,
        onStart: onStartSectionScroll,
        offsetAdjustment,
        direction,
        scrollDuration: scrollDuration ? scrollDuration : 2500,
        scrollEase: scrollEase ? scrollEase : inOutSine,
      });
    }, [selectedSection]);

    return (
      <div
        className={[
          styles.Main,
          "fullpage-base-container",
          styles[direction],
        ].join(" ")}
        ref={mainRef}
        onScroll={(e) => {
          if (onScroll) onScroll(e);
        }}
      >
        {sectionRefArr.map((s, index) => (
          <section
            ref={sectionRefs[index]}
            key={index}
            className={[styles.section, "fullpage-base-section"].join(" ")}
          >
            {s.component}
          </section>
        ))}
      </div>
    );
  }
);

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  destinationRef: React.RefObject<HTMLElement>;
  scrolledRefEl: HTMLElement;
  onStart?: () => void;
  onFinished?: () => void;
  offsetAdjustment?: number;
  scrollDuration: number;
  scrollEase: (time: number) => number;
  direction: "horizontal" | "vertical";
}) => {
  const {
    destinationRef,
    onFinished,
    onStart,
    direction,
    scrolledRefEl,
    scrollDuration,
    scrollEase,
  } = params;

  const offsetAdjustment = params.offsetAdjustment
    ? params.offsetAdjustment
    : 0;

  const offset = directionSetterValue({
    horizontalValue: destinationRef.current.offsetLeft,
    verticalValue: destinationRef.current.offsetTop,
    direction,
  })!;

  const position = offset + offsetAdjustment;

  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;
    const targetScrollPosition = directionSetterValue({
      horizontalValue: target.scrollLeft,
      verticalValue: target.scrollTop,
      direction,
    });

    if (targetScrollPosition === position) {
      onFinished ? onFinished() : {};
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (
    directionSetterValue({
      horizontalValue: scrolledRefEl && scrolledRefEl.scrollLeft !== position,
      verticalValue: scrolledRefEl && scrolledRefEl.scrollTop !== position,
      direction,
    })
  ) {
    onStart ? onStart() : {};
  }

  scrolledRefEl.addEventListener("scroll", scrollListener);
  // scrolledRefEl.scrollTo(
  //   directionSetterValue({
  //     horizontalValue: { behavior: "smooth", left: position },
  //     verticalValue: { behavior: "smooth", top: position },
  //     direction,
  //   })
  // );

  directionSetterValue({
    direction,
    horizontalValue: Scroll.left(scrolledRefEl, position, {
      duration: scrollDuration,
      ease: scrollEase,
    }),
    verticalValue: Scroll.top(scrolledRefEl, position, {
      duration: scrollDuration,
      ease: scrollEase,
    }),
  });
};
