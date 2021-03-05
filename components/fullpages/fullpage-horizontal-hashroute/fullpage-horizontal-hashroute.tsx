import { useRouter } from "next/dist/client/router";
import React from "react";
import { useHashRoute } from "../../../hooks/useHashRoute";
import { FullpageHorizontal } from "../fullpage-horizontal/fullpage-horizontal";

type RouterPath = `/#${string}`;

type FullpageHorizontalRouterSectionRef = {
  component: JSX.Element;
  routerPath: RouterPath;
};

type Props = {
  sectionRouteRefArr: FullpageHorizontalRouterSectionRef[];
  autoScroll: boolean;
};

const FullpageHorizontalHashRoute: React.FC<Props> = ({
  sectionRouteRefArr,
  autoScroll,
}) => {
  const [hashRoute, setHashRoute] = useHashRoute();
  const muteOnScrollRef = React.useRef<boolean>(false);
  const mainRef = React.useRef<HTMLDivElement>();
  const [sectionRefs, setSectionRefs] = React.useState<
    React.RefObject<HTMLElement>[]
  >();
  const [sectionRefArr, setSectionRefArr] = React.useState([]);
  const [refIdx, setRefIdx] = React.useState<number>(0);
  const [disableScroll, setDisableScroll] = React.useState(false);

  // React.useEffect(() => {
  //   // window.onhashchange = onHashChange;
  //   console.log(sectionRefs);
  //   setTimeout(() => {
  //     console.log("tit tot tit", sectionRefs);
  //     setDisableScroll(true);
  //   }, 3000);
  // }, []);

  React.useEffect(() => {
    setSectionRefArr(
      sectionRouteRefArr.map((s) => ({
        component: s.component,
      }))
    );
  }, [sectionRouteRefArr]);

  // React.useEffect(() => {
  //   const routerPath = Router.asPath;
  //   if (routerPath === "/" && sectionRouteRefArr[0]) {
  //     window.location.hash = sectionRouteRefArr[0].routerPath.substring(2);
  //   }

  //   window.onhashchange = onHashChange;
  //   window.location.hash = routerPath.substring(2);
  //   window.dispatchEvent(new HashChangeEvent("hashchange"));
  // }, [Router]);

  React.useEffect(() => {
    const sectionRef = sectionRouteRefArr[refIdx];
    window.location.hash = sectionRef.routerPath.substring(2);
  }, [refIdx]);

  // const onHashChange = () => {
  //   const idx = sectionRouteRefArr.findIndex(
  //     (s) => s.routerPath == "/" + window.location.hash
  //   );
  //   if (idx < 0) {
  //     console.error(window.location.hash + " Hash Link not found");
  //     setRefIdx(0);
  //   } else {
  //     setRefIdx(idx);
  //   }
  // };

  React.useEffect(() => {
    const idx = sectionRouteRefArr.findIndex((s) => s.routerPath == hashRoute);
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      setRefIdx(0);
    } else {
      setRefIdx(idx);
    }
    if (disableScroll) {
      setDisableScroll(false);
    }
  }, [hashRoute]);

  const onScrollMain = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (disableScroll) return;
    if (muteOnScrollRef.current) return;
    const x = sectionRefs.reduce((p, c) => {
      const c_diff = Math.abs(
        event.currentTarget.scrollLeft - c.current.offsetLeft
      );
      const p_diff = Math.abs(
        event.currentTarget.scrollLeft - p.current.offsetLeft
      );
      if (c_diff < p_diff) return c;
      else return p;
    });
    if (autoScroll === false && disableScroll === false) {
      setDisableScroll(true);
    }
    // if (autoScroll === false) {
    //   window.onhashchange = function () {
    //     window.onhashchange = onHashChange;
    //   };
    // }
    const index = sectionRefs.findIndex((s) => s == x);
    setHashRoute(sectionRouteRefArr[index].routerPath);
    // window.location.hash = sectionRouteRefArr[index].routerPath.substring(2);
    // window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <FullpageHorizontal
      sectionRefArr={sectionRefArr}
      selectedSection={sectionRefArr[refIdx]}
      onSectionRefs={setSectionRefs}
      onStartSectionScroll={() => {
        muteOnScrollRef.current = true;
        mainRef.current.style.overflowX = "hidden";
      }}
      onFinishedSectionScroll={() => {
        muteOnScrollRef.current = false;
        mainRef.current.style.overflowX = "scroll";
      }}
      onScroll={onScrollMain}
      disableScroll={disableScroll}
      ref={mainRef}
    />
  );
};

export default FullpageHorizontalHashRoute;
