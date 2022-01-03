import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useHashRoute } from "../hooks/useHashRoute";
import { useWindowSize } from "../hooks/useWindowSize";
import anime from "animejs";

type RouterPath = `/#${string}`;
export type RouterLayout = {
  routerPath: RouterPath;
  labelRoute: string;
};

type Props = {
  routers: RouterLayout[];
};

const Layout: React.FC<Props> = ({ children, routers }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [hashRoute, setHashRoute] = useHashRoute();
  const windowSize = useWindowSize();
  const morphingRef = React.useRef<SVGElement>(null);

  React.useEffect(() => {
    const idx = routers.findIndex((s) => s.routerPath == hashRoute);
    if (idx < 0) {
      setTabValue(0);
    } else {
      setTabValue(idx);
    }
  }, [hashRoute]);

  const svgValue = React.useMemo(() => {
    const horizontalPoint = (116.28 * 100) / windowSize.height;
    // const horizontalPoint = 12;
    console.log(windowSize.width, windowSize.height);
    // const initialSvg = `M 0 ${horizontalPoint} H 32 C 37 ${horizontalPoint}, 37 ${horizontalPoint}, 38 11 Q 50 -3 61 11 C 61 11 62 ${horizontalPoint} 63 ${horizontalPoint} H 100`;
    // const initialSvg = `M 0 12 H 32 C 37 12, 37 12, 38 11 Q 50 -3 61 11 C 61 11 62 12 63 12 H 100`;
    // const initialSvg = `M 0 12 H 12 C 17 12, 17 12, 18 12 Q 50 -3 81 12 C 81 12 81 12 81 12 H 100`;

    // const initialSvg = `M 0 ${horizontalPoint} H 32 C 37 ${horizontalPoint}, 37 ${horizontalPoint}, 38 ${
    //   horizontalPoint - 1
    // } Q 50 ${horizontalPoint - 15} 61 ${horizontalPoint - 1} C 61 ${
    //   horizontalPoint - 1
    // } 62 ${horizontalPoint} 63 ${horizontalPoint} H 100`;

    // const initialSvg = `M 0 ${horizontalPoint} H 32 C 37 ${horizontalPoint}, 37 ${horizontalPoint}, 38 ${horizontalPoint} Q 50 ${
    //   horizontalPoint - 15
    // } 61 ${horizontalPoint} C 61 ${horizontalPoint} 61 ${horizontalPoint} 62 ${horizontalPoint} H 100`;
    const initialSvg = `M 0 ${horizontalPoint} H 32 C 37 ${horizontalPoint}, 37 ${horizontalPoint}, 38 ${horizontalPoint} Q 50 ${
      horizontalPoint - 15
    } 61 ${horizontalPoint} C 61 ${horizontalPoint} 61 ${horizontalPoint} 62 ${horizontalPoint} H 100`;
    return {
      initialSvg,
      svgAnimations: [
        // "M 0 12 H 33 C 33 12, 37 12, 38 11 Q 50 -2 62 11 C 62 11, 63 12, 67 12 H 100",
        initialSvg,
        `M 0 ${horizontalPoint} H 100`,
        initialSvg,
      ].join(";"),
    };
  }, [windowSize]);

  return (
    <>
      <Head>
        <title>WHATABYTE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <div className="layoutContainer">
        <div className="header">
          <Tabs value={tabValue}>
            {routers.map((r) => (
              <Link href={r.routerPath} shallow={true} key={r.routerPath}>
                <Tab label={r.labelRoute} />
              </Link>
            ))}
          </Tabs>

          <div className={"morphing-demo "}>
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 100 100`}
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                top: "0",
                height: "100vh",
                zIndex: -1,
              }}
            >
              <path
                // d="M 0 12 H 33 C 33 12, 37 12, 38 11 Q 50 -2 62 11 C 62 11, 63 12, 67 12 H 100"
                d={svgValue.initialSvg}
                stroke="black"
                fill="transparent"
                strokeWidth=".1"
              >
                <animate
                  attributeName="d"
                  ref={morphingRef}
                  values={svgValue.svgAnimations}
                  begin="indefinite"
                  dur={"1s"}
                  repeatCount="1"
                  fill="freeze"
                />
              </path>
            </svg>
          </div>
          <button
            onClick={() => {
              console.log("hi");
              //@ts-ignore
              morphingRef.current.beginElement();
            }}
          >
            test
          </button>
        </div>
        <div className="layout">{children}</div>
      </div>
    </>
  );
};

export default Layout;
