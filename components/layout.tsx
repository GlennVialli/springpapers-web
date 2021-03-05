import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useHashRoute } from "../hooks/useHashRoute";

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
        </div>
        <div className="layout">{children}</div>
      </div>
    </>
  );
};

export default Layout;
