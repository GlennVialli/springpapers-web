import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useHashRoute } from "../hooks/useHashRoute";
import { useWindowSize } from "../hooks/useWindowSize";

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

  React.useEffect(() => {
    const idx = routers.findIndex((s) => s.routerPath == hashRoute);
    if (idx < 0) {
      setTabValue(0);
    } else {
      setTabValue(idx);
    }
  }, [hashRoute]);

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

          {/* <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
            }}
          >
            <path
              d="M 0 12 H 32 C 37 12, 37 12, 38 11 Q 50 -3 61 11 C 61 11 62 12 63 12 H 100"
              stroke="black"
              fill="transparent"
              strokeWidth=".1"
            />
          </svg> */}

          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
            }}
          >
            <path
              d="M 0 12 H 33 C 33 12, 37 12, 38 11 Q 50 -2 62 11 C 62 11, 63 12, 67 12 H 100"
              stroke="black"
              fill="transparent"
              strokeWidth=".1"
            />
          </svg>

          {/* <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
            }}
          >
            <path
              d={`M 0 ${(116.28 * 100) / windowSize.height} H 100`}
              stroke="black"
              fill="transparent"
              strokeWidth=".1"
            />
          </svg> */}
        </div>
        <div className="layout">{children}</div>
      </div>
    </>
  );
};

export default Layout;
