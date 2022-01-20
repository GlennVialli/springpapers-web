import React from "react";
import { OnScrollFullpage, useFullPage } from "./useFullPage";

type ArgsOnScrollFullpage = Parameters<OnScrollFullpage>[0];
export const useOnScrollFullpageWhenPercentView = (
  FullpageHook: ReturnType<typeof useFullPage>
) => {
  const {
    getSectionRefs,
    getCurrentSectionIndex,
    fullpageBaseProps,
    goToSectionByIndex,
  } = FullpageHook;
  return React.useCallback<
    (o: ArgsOnScrollFullpage, percentView?: number) => void
  >(
    (o, percentView) => {
      const { event, scrollDirection } = o;
      const sectionRefs = getSectionRefs()?.current;
      if (!sectionRefs) return;

      const currentIndex = getCurrentSectionIndex();
      const index =
        currentIndex +
        (() => {
          if (scrollDirection === "right" || scrollDirection === "down")
            return 1;
          if (scrollDirection === "left" || scrollDirection === "up") return -1;
        })();
      const nextSection = sectionRefs[index];
      if (!nextSection) return;

      const percentageView = (() => {
        const percent = percentView ?? 50;
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
      goToSectionByIndex(index);
    },
    [
      getSectionRefs,
      fullpageBaseProps.disableSectionScroll,
      getCurrentSectionIndex,
    ]
  );
};
