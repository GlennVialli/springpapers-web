import Head from "next/head";
import Link from "next/link";
import React from "react";

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
          <ul>
            {routers.map((r) => (
              <li key={r.routerPath}>
                <Link href={r.routerPath} shallow={true}>
                  <a>{r.labelRoute}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="layout">{children}</div>
      </div>
    </>
  );
};

export default Layout;
