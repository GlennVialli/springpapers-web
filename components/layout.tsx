import Head from "next/head";
import Link from "next/link";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Table } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";

type RouterPath = `/#${string}`;
export type RouterLayout = {
  routerPath: RouterPath;
  labelRoute: string;
};

type Props = {
  routers: RouterLayout[];
};

const Layout: React.FC<Props> = ({ children, routers }) => {
  const Router = useRouter();
  const [tabValue, setTabValue] = React.useState(0);

  // NEED TO MAKE A STANDALONE HOOKS AND IMPLEMENT TO FULLPAGE-HORIZONTAL-HASHROUTE AND FULLPAGE-VERTICAL-HASROUTE
  const onHashChange = () => {
    const idx = routers.findIndex(
      (s) => s.routerPath == "/" + window.location.hash
    );
    if (idx < 0) {
      console.error(window.location.hash + " Hash Link not found");
      setTabValue(0);
    } else {
      setTabValue(idx);
    }
  };

  React.useEffect(() => {
    window.onhashchange = onHashChange;
  }, []);

  React.useEffect(() => {
    const routerPath = Router.asPath;
    if (routerPath === "/" && routers[0]) {
      window.location.hash = routers[0].routerPath.substring(2);
    }

    window.onhashchange = onHashChange;
    window.location.hash = routerPath.substring(2);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [Router]);
  // ******************************************************************************************************************

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
