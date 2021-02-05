import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Layout: React.FC = ({ children }) => {
  //   const Router = useRouter();
  //   React.useEffect(() => {
  //     Router.events.on("routeChangeStart", (url, x) => {
  //       console.log(url, x);
  //     });
  //   }, []);

  return (
    <>
      <Head>
        <title>WHATABYTE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <ul>
        <li>
          <Link href="/home" shallow={true}>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/about" shallow={true}>
            <a>About</a>
          </Link>
        </li>
      </ul>
      <div className="layout">{children}</div>
    </>
  );
};

export default Layout;
