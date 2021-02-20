import React from "react";
import styles from "./fullpage-vertical.module.scss";

export type FullpageVerticalSectionRef = {
  component: JSX.Element;
};

type Props = {
  sectionRefArr: FullpageVerticalSectionRef[];
  selectedSection: FullpageVerticalSectionRef;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onStartSectionScroll?: () => void;
  onFinishedSectionScroll?: () => void;
  onSectionRefs?: (ref: React.RefObject<HTMLElement>[]) => void;
};

export const FullpageVertical: React.FC<Props> = ({
  sectionRefArr,
  selectedSection,
  onScroll,
  onStartSectionScroll,
  onFinishedSectionScroll,
  onSectionRefs,
}) => {
  const mainRef = React.useRef<HTMLDivElement>();
  const sectionRefs = useSectionRefs(sectionRefArr);

  React.useEffect(() => {
    if (onSectionRefs) onSectionRefs(sectionRefs);
  }, [sectionRefs]);

  React.useEffect(() => {
    const idx = sectionRefArr.findIndex((s) => s == selectedSection);
    if (idx < 0) {
      console.error("section not found");
      return;
    }
    scrollToSection({
      destinationRef: sectionRefs[idx],
      scrolledRefEl: mainRef.current,
      onFinished: onFinishedSectionScroll,
      onStart: onStartSectionScroll,
    });
  }, [selectedSection]);

  return (
    <div
      className={[styles.Main, "fullpage-vertical-container"].join(" ")}
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
};

// EXTRA HOOKS
const useSectionRefs = (sectionRefArr: FullpageVerticalSectionRef[]) => {
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
}) => {
  const { destinationRef, scrolledRefEl, onFinished, onStart } = params;

  const position = destinationRef.current.offsetTop - 100;
  const scrollListener = (evt) => {
    if (typeof evt === "undefined") {
      return;
    }

    const target = evt.currentTarget;

    if (target.scrollTop === position) {
      onFinished ? onFinished() : {};
      target.removeEventListener("scroll", scrollListener);
    }
  };

  if (scrolledRefEl && scrolledRefEl.scrollTop !== position) {
    onStart ? onStart() : {};
  } else if (!scrolledRefEl && window.screenTop !== position) {
    onStart ? onStart() : {};
  }

  if (scrolledRefEl) {
    scrolledRefEl.addEventListener("scroll", scrollListener);
    scrolledRefEl.scrollTo({
      behavior: "smooth",
      top: position,
    });
  } else {
    window.addEventListener("scroll", scrollListener);
    window.scrollTo({
      behavior: "smooth",
      top: position,
    });
  }
};
