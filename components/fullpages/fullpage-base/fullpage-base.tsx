import { dir } from "console";
import React from "react";
import { OrientationType, orientationSetterValue } from "../direction-utils";
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
  direction: OrientationType;
  maxOffset?: number;
};

export const FullpageBase = React.forwardRef<HTMLDivElement, Props>(
  (params, ref: React.MutableRefObject<HTMLDivElement>) => {
    const mainRef = React.useRef<HTMLDivElement>();
    const sectionRefs = React.useMemo(
      () => params.sectionRefArr.map(() => React.createRef<HTMLElement>()),
      [params.sectionRefArr]
    );
    React.useEffect(() => {
      ref.current = mainRef.current;
    }, [mainRef, mainRef.current]);

    React.useEffect(() => {
      params.onLoadSectionRefs?.(sectionRefs);
    }, [sectionRefs]);

    React.useEffect(() => {
      const idx = params.sectionRefArr.findIndex(
        (s) => s == params.selectedSection
      );
      if (idx < 0) {
        console.error("section not found");
        return;
      }

      if (params.disableSectionScroll) {
        params.onFinishedSectionScroll?.();
        return;
      }

      const offsetAdjustment = orientationSetterValue({
        horizontalValue: -sectionRefs[0].current.offsetLeft,
        verticalValue: -sectionRefs[0].current.offsetTop,
        direction: params.direction,
      });

      scrollToSection({
        destinationRef: sectionRefs[idx],
        scrolledRefEl: mainRef.current,
        onFinished: params.onFinishedSectionScroll,
        onStart: params.onStartSectionScroll,
        offsetAdjustment,
        direction: params.direction,
        scrollDuration: params.scrollDuration ?? 2500,
        scrollEase: params.scrollEase ?? inOutSine,
        maxOffset: params.maxOffset ?? 0,
      });
    }, [params.selectedSection]);

    return (
      <div
        className={[
          styles.Main,
          "fullpage-base-container",
          styles[params.direction],
        ].join(" ")}
        ref={mainRef}
        onScroll={(e) => {
          params.onScroll?.(e);
        }}
      >
        {params.sectionRefArr.map((s, index) => (
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
  maxOffset: number;
}) => {
  const offsetAdjustment = params.offsetAdjustment
    ? params.offsetAdjustment
    : 0;

  const offset = orientationSetterValue({
    horizontalValue: params.destinationRef.current.offsetLeft,
    verticalValue: params.destinationRef.current.offsetTop,
    direction: params.direction,
  })!;

  const position = offset + offsetAdjustment;

  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;
    const targetScrollPosition = orientationSetterValue({
      horizontalValue: target.scrollLeft,
      verticalValue: target.scrollTop,
      direction: params.direction,
    });

    const offset = Math.abs(targetScrollPosition - position);
    if (offset >= 0 && offset <= params.maxOffset) {
      params.onFinished?.();
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (
    orientationSetterValue({
      horizontalValue:
        params.scrolledRefEl && params.scrolledRefEl.scrollLeft !== position,
      verticalValue:
        params.scrolledRefEl && params.scrolledRefEl.scrollTop !== position,
      direction: params.direction,
    })
  ) {
    params.onStart?.();
  }

  params.scrolledRefEl.addEventListener("scroll", scrollListener);

  orientationSetterValue({
    direction: params.direction,
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
