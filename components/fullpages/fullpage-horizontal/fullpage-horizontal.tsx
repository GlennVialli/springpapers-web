import React from "react";
import styles from "./fullpage-horizontal.module.scss";

export type FullpageHorizontalSectionRef = {
  component: JSX.Element;
};

type Props = {
  sectionRefArr: FullpageHorizontalSectionRef[];
  selectedSection: FullpageHorizontalSectionRef;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onStartSectionScroll?: () => void;
  onFinishedSectionScroll?: () => void;
  onSectionRefs?: (ref: React.RefObject<HTMLElement>[]) => void;
  disableScroll?: boolean;
};

export const FullpageHorizontal = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      sectionRefArr,
      selectedSection,
      onScroll,
      onStartSectionScroll,
      onFinishedSectionScroll,
      onSectionRefs,
      disableScroll,
    },
    ref: React.MutableRefObject<HTMLDivElement>
  ) => {
    const mainRef = React.useRef<HTMLDivElement>();
    const sectionRefs = useSectionRefs(sectionRefArr);

    React.useEffect(() => {
      ref.current = mainRef.current;
    }, [mainRef, mainRef.current]);

    React.useEffect(() => {
      if (onSectionRefs) onSectionRefs(sectionRefs);
    }, [sectionRefs]);

    React.useEffect(() => {
      console.log("fh", disableScroll, sectionRefs);
      if (onSectionRefs) onSectionRefs(sectionRefs);
    }, [disableScroll]);

    React.useEffect(() => {
      const idx = sectionRefArr.findIndex((s) => s == selectedSection);
      if (idx < 0) {
        console.error("section not found");
        return;
      }
      console.log(disableScroll);
      if (disableScroll) {
        return;
      }
      scrollToSection({
        destinationRef: sectionRefs[idx],
        scrolledRefEl: mainRef.current,
        onFinished: onFinishedSectionScroll,
        onStart: onStartSectionScroll,
        offsetLeftAdjustment: -sectionRefs[0].current.offsetLeft,
      });
    }, [selectedSection]);

    return (
      <div
        className={[styles.Main, "fullpage-Horizontal-container"].join(" ")}
        ref={mainRef}
        onScroll={(e) => {
          if (onScroll) onScroll(e);
        }}
      >
        {sectionRefArr.map((s, index) => (
          <section
            ref={sectionRefs[index]}
            key={index}
            className={styles.section}
          >
            {s.component}
          </section>
        ))}
      </div>
    );
  }
);

// EXTRA HOOKS
const useSectionRefs = (sectionRefArr: FullpageHorizontalSectionRef[]) => {
  return React.useMemo(
    () => sectionRefArr.map(() => React.createRef<HTMLElement>()),
    [sectionRefArr]
  );
};

// EXTRA FUNCTIONS
const scrollToSection = (params: {
  destinationRef: React.RefObject<HTMLElement>;
  scrolledRefEl?: HTMLElement;
  onStart?: () => void;
  onFinished?: () => void;
  offsetLeftAdjustment?: number;
}) => {
  const { destinationRef, scrolledRefEl, onFinished, onStart } = params;

  const offsetLeftAdjustment = params.offsetLeftAdjustment
    ? params.offsetLeftAdjustment
    : 0;

  const position = destinationRef.current.offsetLeft + offsetLeftAdjustment;

  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;

    if (target.scrollLeft === position) {
      onFinished ? onFinished() : {};
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (scrolledRefEl && scrolledRefEl.scrollLeft !== position) {
    onStart ? onStart() : {};
  } else if (!scrolledRefEl && window.screenLeft !== position) {
    onStart ? onStart() : {};
  }

  if (scrolledRefEl) {
    scrolledRefEl.addEventListener("scroll", scrollListener);
    scrolledRefEl.scrollTo({
      behavior: "smooth",
      left: position,
    });
  } else {
    window.addEventListener("scroll", scrollListener);
    window.scrollTo({
      behavior: "smooth",
      left: position,
    });
  }
};
