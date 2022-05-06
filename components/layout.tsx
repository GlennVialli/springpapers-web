import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useHashRoute } from "../hooks/useHashRoute";
import { useWindowSize } from "../hooks/useWindowSize";
import zIndex from "@material-ui/core/styles/zIndex";

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
          <div className="cap-complete">
            <img src="/img/SP-Image1.png" />
          </div>
          <div className="topHeader zigzag-border-bottom">
            <div className="title">
              <img src="/img/SP-Logo.png" />
            </div>
          </div>

          <Tabs
            value={tabValue}
            onChange={(e, v) =>
              routers[v] ? setHashRoute(routers[v].routerPath) : {}
            }
            variant="scrollable"
            scrollButtons="on"
          >
            {routers.map((r) => (
              <Tab
                label={r.labelRoute}
                icon={<img src="/img/SP-Icon-bunga.png" alt="Vercel Logo" />}
              />
            ))}
          </Tabs>
        </div>
        <div className="layout">{children}</div>
      </div>
    </>
  );
};

export default Layout;
