import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

export const useHashRoute = () => {
  const Router = useRouter();
  const routerHashState = useState("");
  const [routerHash, setRouterHash] = routerHashState;

  const hashchange = () => {
    const locationHash = "/" + window.location.hash;
    Router.push(locationHash);
  };

  useEffect(() => {
    window.addEventListener("hashchange", hashchange);

    return () => window.removeEventListener("hashchange", hashchange);
  }, []);

  useEffect(() => {
    setRouterHash(Router.asPath);
  }, [Router]);

  useEffect(() => {
    // console.log(verbose, routerHash, window.location.hash, Router.asPath);
    // window.location.hash = routerHash.substring(2);
  }, [routerHash]);

  return routerHashState;
};
