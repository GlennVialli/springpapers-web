import { Router, useRouter } from "next/dist/client/router";
import React from "react";
import { Cat1 } from "../components/catalogue-components/cat1";
import { Cat2 } from "../components/catalogue-components/cat2";
import { Cat3 } from "../components/catalogue-components/cat3";
import styles from "../components/catalogue-components/catalogue.module.scss";
import {
  FullpageVertical,
  FullpageVerticalSectionRef,
} from "../components/fullpages/fullpage-vertical/fullpage-vertical";
import { If } from "../components/If";

const sectionRefArr: FullpageVerticalSectionRef[] = [
  {
    component: <Cat1 />,
  },
  {
    component: <Cat2 />,
  },
  {
    component: <Cat3 />,
  },
];
var lastScrollTop = 0;

const Catalogue: React.FC = () => {
  const [refIdx, setRefIdx] = React.useState<number>(0);
  const [sectionRefs, setSectionRefs] = React.useState<
    React.RefObject<HTMLElement>[]
  >();
  const muteOnScrollRef = React.useRef(false);
  const fullpageRef = React.useRef<HTMLDivElement>();
  const router = useRouter();

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    let limiter = 0;
    if (e.currentTarget.scrollTop > lastScrollTop) {
      // downscroll
      limiter = 200;
    } else {
      // upscroll
      limiter = -100;
    }
    lastScrollTop = e.currentTarget.scrollTop;

    const x = sectionRefs.reduce((p, c) => {
      const c_diff = Math.abs(
        e.currentTarget.scrollTop - c.current.offsetTop + limiter
      );
      const p_diff = Math.abs(
        e.currentTarget.scrollTop - p.current.offsetTop + limiter
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    const index = sectionRefs.findIndex((s) => s === x);
    setRefIdx(index);
  };

  return (
    <div className={styles.container}>
      <h1>Catalogue</h1>
      <FullpageVertical
        sectionRefArr={sectionRefArr}
        selectedSection={sectionRefArr[refIdx]}
        onSectionRefs={setSectionRefs}
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
        ref={fullpageRef}
      />
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
