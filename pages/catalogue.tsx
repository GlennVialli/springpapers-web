import { useRouter } from "next/dist/client/router";
import React from "react";
import { Cat1 } from "../components/catalogue-components/cat1";
import { Cat2 } from "../components/catalogue-components/cat2";
import { Cat3 } from "../components/catalogue-components/cat3";
import styles from "../components/catalogue-components/catalogue.module.scss";
import { If } from "../components/If";
import { useFullPage } from "../hooks/fullpage_hooks/useFullPage";
import { useOnScrollFullpageWhenPercentView } from "../hooks/fullpage_hooks/useOnScrollFullpageWhenPercentView";

const Catalogue: React.FC = () => {
  const Fullpage = useFullPage();
  const {
    FullpageBase,
    FullpageSection,
    fullpageBaseProps,
    goToSectionByIndex,
    getCurrentSectionIndex,
  } = Fullpage;

  const sectionRefs = React.useRef<HTMLElement[]>(Array(3));
  const fullpageRef = React.useRef<HTMLDivElement>();
  const router = useRouter();
  const onScrollFullpagePercentView =
    useOnScrollFullpageWhenPercentView(Fullpage);

  return (
    <div className={[styles.container, "catalogue-container"].join(" ")}>
      <h1>Catalogue</h1>
      <FullpageBase
        {...fullpageBaseProps}
        onScrollFullpage={(o) => {
          onScrollFullpagePercentView(o, 20);
        }}
        orientation={"vertical"}
        scrollDuration={1300}
        ref={fullpageRef}
      >
        <FullpageSection ref={(r) => (sectionRefs.current[0] = r)}>
          <Cat1></Cat1>
        </FullpageSection>
        <FullpageSection ref={(r) => (sectionRefs.current[1] = r)}>
          <Cat2></Cat2>
        </FullpageSection>
        <FullpageSection ref={(r) => (sectionRefs.current[2] = r)}>
          <Cat3></Cat3>
        </FullpageSection>
      </FullpageBase>
      <button
        className={styles.nextButton}
        onClick={() => {
          const nextIdx = getCurrentSectionIndex() + 1;
          goToSectionByIndex(nextIdx);
        }}
      >
        NEXT
      </button>
    </div>
  );
};

export default Catalogue;
