import Home from "./home";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Layout from "../components/layout";
import About from "./about";

export default function Index() {
  const Router = useRouter();

  React.useEffect(() => {
    Router.events.on("routeChangeStart", (url, x) => {
      console.log(url, x);
    });
    // if (Router.pathname == "/") {
    //   Router.push("/home");
    // }
  }, [Router]);

  return (
    <Layout>
      <section>
        <Home />
      </section>
      <section>
        <About />
      </section>
    </Layout>
  );
}
