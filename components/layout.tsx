import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";

type RouterPath = `/#${string}`;
export type RouterLayout = {
  routerPath: RouterPath;
  labelRoute: string;
};

type Props = {
  routers: RouterLayout[];
};

const Layout: React.FC<Props> = ({ children, routers }) => {
  return (
    <>
      <Head>
        <title>WHATABYTE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <div className="layoutContainer">
        <div className="header">
          <Tabs>
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
