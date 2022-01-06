import { Router, useRouter } from "next/dist/client/router";
import React from "react";
import { Cat1 } from "../components/catalogue-components/cat1";
import { Cat2 } from "../components/catalogue-components/cat2";
import { Cat3 } from "../components/catalogue-components/cat3";
import styles from "../components/catalogue-components/catalogue.module.scss";
// import { FullpageBase } from "../components/fullpages/fullpage-base/fullpage-base";
import {
  FullpageVertical,
  FullpageVerticalSectionRef,
} from "../components/fullpages/deprecated-legacy/fullpage-vertical/fullpage-vertical";
import { If } from "../components/If";
import { useFullPage } from "../hooks/useFullPage";

var lastScrollTop = 0;

const Catalogue: React.FC = () => {
  const sectionRefArr = React.useMemo<FullpageVerticalSectionRef[]>(
    () => [
      {
        component: <Cat1 />,
      },
      {
        component: <Cat2 />,
      },
      {
        component: <Cat3 />,
      },
    ],
    []
  );
  const [refIdx, setRefIdx] = React.useState<number>(0);
  const { FullpageBaseExperimental, FullpageSection } = useFullPage();
  // const [sectionRefs, setSectionRefs] =
  //   React.useState<React.RefObject<HTMLElement>[]>();
  // const sectionRefs = getSectionRefs();
  const section1 = React.useRef<HTMLElement>();
  const section2 = React.useRef<HTMLElement>();
  const section3 = React.useRef<HTMLElement>();

  const sectionRefs = React.useMemo(
    () => [section1, section2, section3],
    [section1, section2, section3]
  );
  // const sectionRefs = React.useRef<HTMLElement[]>(Array(3));
  const muteOnScrollRef = React.useRef(false);
  const fullpageRef = React.useRef<HTMLDivElement>();
  const router = useRouter();

  // console.log(sectionRefs.current);
  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    let limiter = 0;
    if (e.currentTarget.scrollTop > lastScrollTop) {
      // downscroll
      limiter = 350;
    } else {
      // upscroll
      limiter = -350;
    }
    lastScrollTop = e.currentTarget.scrollTop;

    const x = sectionRefs.reduce((p, c) => {
      const c_diff = Math.abs(
        e.currentTarget.scrollTop -
          c.current.offsetTop +
          limiter +
          fullpageRef.current.offsetTop
      );
      const p_diff = Math.abs(
        e.currentTarget.scrollTop -
          p.current.offsetTop +
          limiter +
          fullpageRef.current.offsetTop
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    const index = sectionRefs.findIndex((s) => s === x);
    // console.log(index);
    setRefIdx(index);
  };

  return (
    <div className={[styles.container, "catalogue-container"].join(" ")}>
      <h1>Catalogue</h1>
      <FullpageBaseExperimental
        selectedIndex={refIdx}
        onScroll={(e) => {
          if (muteOnScrollRef.current) return;
          onScroll(e);
        }}
        onStartSectionScroll={() => {
          muteOnScrollRef.current = true;
          fullpageRef.current.style.overflowY = "hidden";
        }}
        onFinishedSectionScroll={() => {
          muteOnScrollRef.current = false;
          fullpageRef.current.style.overflowY = "scroll";
        }}
        direction={"vertical"}
        scrollDuration={1300}
        ref={fullpageRef}
        maxOffset={1}
      >
        <FullpageSection ref={section1}>
          <Cat1></Cat1>
        </FullpageSection>
        <FullpageSection ref={section2}>
          <Cat2></Cat2>
        </FullpageSection>
        <FullpageSection ref={section3}>
          <Cat3></Cat3>
        </FullpageSection>
      </FullpageBaseExperimental>
      <If
        condition={
          refIdx < sectionRefArr.length - 1 && router.asPath == "/#catalogue"
        }
      >
        <button
          className={styles.nextButton}
          onClick={() => {
            const nextIdx = refIdx + 1;
            if (nextIdx > sectionRefArr.length - 1) return;
            setRefIdx(nextIdx);
          }}
        >
          NEXT
        </button>
      </If>
    </div>
  );
};

export default Catalogue;
