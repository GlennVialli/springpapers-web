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
    let id = Router.asPath.match(/#([a-z0-9]+)/gi);
    if (id) {
      // i will show the modal
      console.log(id);
    } else {
      // something else
    }
  }, [Router]);

  return (
    <Layout>
      <section id="home" className="section">
        <Home />
      </section>
      <section id="about" className="section">
        <About />
      </section>
    </Layout>
  );
}
