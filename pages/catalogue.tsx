import { Router, useRouter } from "next/dist/client/router";
import React from "react";
import { Cat1 } from "../components/catalogue-components/cat1";
import { Cat2 } from "../components/catalogue-components/cat2";
import { Cat3 } from "../components/catalogue-components/cat3";
import styles from "../components/catalogue-components/catalogue.module.scss";
import {
  FullpageVertical,
  FullpageVerticalSectionRef,
} from "../components/fullpage-vertical/fullpage-vertical";
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

const Catalogue: React.FC = () => {
  const [refIdx, setRefIdx] = React.useState<number>(0);
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1>Catalogue</h1>
      <FullpageVertical
        sectionRefArr={sectionRefArr}
        selectedSection={sectionRefArr[refIdx]}
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
