import React from "react";
import styles from "./fullpage-horizontal.module.scss";

type RouterPath = `/#${string}`;

type FullpageHorizontalSectionRef = {
  ref: React.MutableRefObject<HTMLElement>;
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRefArr: FullpageHorizontalSectionRef[];
};

const FullpageHorizontal: React.FC<Props> = ({ sectionRefArr }) => {
  const mainRef = React.useRef<HTMLDivElement>();
  return (
    <div className={styles.Main} ref={mainRef}>
      {sectionRefArr.map((s) => (
        <section ref={s.ref} key={s.routerPath} className={styles.section}>
          {s.component}
        </section>
      ))}
    </div>
  );
};

export default FullpageHorizontal;
