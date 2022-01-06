import React from "react";
import { DirectionType } from "../direction-utils";
import styles from "./fullpage-base-experimental.module.scss";

type Props = {
  direction: DirectionType;
};

export const FullpageBaseExperimental = React.forwardRef<
  HTMLDivElement,
  Props & React.HTMLProps<HTMLDivElement>
>((params, ref: React.MutableRefObject<HTMLDivElement>) => {
  const mainRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    ref = mainRef;
  }, [mainRef]);

  const sectionRefs = React.useMemo(
    () =>
      React.Children.toArray(params.children).map((c) => ({
        ref: React.createRef<HTMLElement>(),
        component: c,
      })),
    [params.children]
  );

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
      {sectionRefs.map((s, index) => (
        <section
          ref={s.ref}
          key={index}
          className={[styles.section, "fullpage-base-section"].join(" ")}
        >
          {s.component}
        </section>
      ))}
    </div>
  );
});
