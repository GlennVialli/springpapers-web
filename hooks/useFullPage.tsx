import React from "react";
import styles from "../components/fullpages/fullpage-base-experimental/fullpage-base-experimental.module.scss";
import {
  directionSetterValue,
  DirectionType,
} from "../components/fullpages/direction-utils";
import { inOutSine } from "../components/fullpages/ease-utils";
import Scroll from "scroll";
import { FullpageBaseRef } from "../components/fullpages/fullpage-base/fullpage-base";

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

  const offset = directionSetterValue({
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
    const targetScrollPosition = directionSetterValue({
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
    directionSetterValue({
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

  directionSetterValue({
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

type Props = {
  sectionRefArr: FullpageBaseRef[];
  direction: DirectionType;
  selectedIndex: number;
  disableSectionScroll?: boolean;
  scrollDuration?: number;
  maxOffset?: number;
  scrollEase?: (time: number) => number;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onStartSectionScroll?: () => void;
  onFinishedSectionScroll?: () => void;
};

const FullpageBaseExperimental = (_p: {
  onLoadSectionRefs: (ref: React.RefObject<HTMLElement>[]) => void;
}) =>
  React.forwardRef<HTMLDivElement, Props & React.HTMLProps<HTMLDivElement>>(
    (params, ref: React.MutableRefObject<HTMLDivElement>) => {
      const mainRef = React.useRef<HTMLDivElement>();
      const sectionRefs = React.useMemo(
        () => params.sectionRefArr.map(() => React.createRef<HTMLElement>()),
        [params.sectionRefArr]
      );

      // const sectionRefs = React.useMemo(
      //   () =>
      //     params.sectionRefArr.map((s) => ({
      //       ref: React.createRef<HTMLElement>(),
      //       component: s.component,
      //     })),
      //   [params.sectionRefArr]
      // );

      // const sectionRefs = React.useMemo(
      //   () =>
      //     React.Children.toArray(params.children).map((s) => ({
      //       ref: React.createRef<HTMLElement>(),
      //       component: s,
      //     })),
      //   [params.children]
      // );

      React.useEffect(() => {
        ref.current = mainRef.current;
      }, [mainRef, mainRef.current]);

      React.useEffect(() => {
        _p.onLoadSectionRefs?.([...sectionRefs]);
      }, [params.sectionRefArr]);

      React.useEffect(() => {
        const idx = params.selectedIndex;
        if (idx < 0) {
          console.error("section not found");
          return;
        }

        if (params.disableSectionScroll) {
          params.onFinishedSectionScroll?.();
          return;
        }

        if (!sectionRefs[0]) return;
        const offsetAdjustment = directionSetterValue({
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
      }, [params.selectedIndex]);

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

export const useFullPage = () => {
  const [sectionRefs, setSectionRefs] =
    React.useState<React.RefObject<HTMLElement>[]>();

  return {
    FullpageBaseExperimental: React.useMemo(
      () =>
        FullpageBaseExperimental({
          onLoadSectionRefs: setSectionRefs,
        }),
      [setSectionRefs]
    ),
    getSectionRefs: React.useCallback(() => sectionRefs, [sectionRefs]),
  };
};
