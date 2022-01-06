import React, {
  HTMLProps,
  PropsWithRef,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
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
  destinationRef: HTMLElement;
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
    horizontalValue: params.destinationRef.offsetLeft,
    verticalValue: params.destinationRef.offsetTop,
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

interface PropsFullpageSection {}
const FullpageSection = (_p: {}) =>
  React.forwardRef<
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

type PropsFullpageBase = {
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

const FullpageBaseExperimental = (_p: {}) =>
  React.forwardRef<
    HTMLDivElement,
    PropsFullpageBase & React.HTMLProps<HTMLDivElement>
  >((params, ref: React.MutableRefObject<HTMLDivElement>) => {
    const mainRef = React.useRef<HTMLDivElement>();
    const sectionRefs = React.useRef<HTMLElement[]>(
      Array(React.Children.toArray(params.children).length)
    );

    // console.log(sectionRefs.current);
    React.useEffect(() => {
      ref.current = mainRef.current;
    }, [mainRef, mainRef.current]);

    React.useEffect(() => {
      const idx = params.selectedIndex;
      console.log(idx);
      if (idx < 0) {
        console.error("section not found");
        return;
      }

      if (params.disableSectionScroll) {
        params.onFinishedSectionScroll?.();
        return;
      }

      if (!sectionRefs.current[0]) return;
      const offsetAdjustment = directionSetterValue({
        horizontalValue: -sectionRefs.current[0].offsetLeft,
        verticalValue: -sectionRefs.current[0].offsetTop,
        direction: params.direction,
      });

      scrollToSection({
        destinationRef: sectionRefs.current[idx],
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
  return {
    FullpageBaseExperimental: React.useMemo(
      () => FullpageBaseExperimental({}),
      []
    ),
    FullpageSection: React.useMemo(() => {
      return FullpageSection({});
    }, []),
  };
};
