import Head from "next/head";
import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { InputBase } from "@material-ui/core";
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
          <div className="cap-complete">
            <img src="/img/SP-Image1.png" />
          </div>
          <div className="topHeader zigzag-border-bottom">
            <div className="search-bar">
              <div className="search-icon">
                <svg
                  className="MuiSvgIcon-root"
                  focusable="false"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    d="M 191 40.633 C 181.848 41.767, 165.965 45.377, 156.529 48.467 C 94.462 68.799, 48.483 125.091, 40.953 189.965 C 39.119 205.768, 40.224 231.616, 43.348 246 C 58.287 314.782, 111.887 366.778, 180.569 379.115 C 194.795 381.670, 222.709 382.187, 235.500 380.132 C 266.497 375.152, 295.079 362.754, 317.236 344.679 C 320.391 342.106, 323.317 340, 323.739 340 C 324.161 340, 353.754 369.257, 389.503 405.015 C 456.075 471.606, 457.299 472.706, 463.226 471.277 C 466.449 470.500, 470.716 466.269, 471.286 463.283 C 472.478 457.049, 471.572 456.040, 405.015 389.503 C 369.257 353.754, 340 324.161, 340 323.739 C 340 323.317, 342.106 320.391, 344.679 317.236 C 362.756 295.077, 375.166 266.464, 380.129 235.500 C 382.253 222.246, 381.754 194.628, 379.134 180.500 C 367.738 119.039, 324.268 68.329, 266.500 49.103 C 246.198 42.347, 237.242 40.867, 214.500 40.512 C 203.500 40.340, 192.925 40.394, 191 40.633 M 189.500 63.516 C 132.262 72.779, 86.599 111.717, 69.171 166.126 C 63.822 182.823, 62.550 191.601, 62.595 211.500 C 62.654 237.907, 66.446 254.159, 77.993 277.500 C 97.690 317.316, 134.443 346.121, 179 356.663 C 194.547 360.342, 219.019 360.998, 235.506 358.179 C 300.517 347.061, 349.699 296.089, 359.079 230.108 C 360.598 219.421, 359.697 192.212, 357.486 182 C 353.944 165.638, 345.392 144.386, 337.203 131.598 C 315.365 97.495, 280.554 73.522, 240.500 65.005 C 227.254 62.188, 202.224 61.457, 189.500 63.516"
                    stroke="none"
                    fill="#040404"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <div className="title">
              <img src="/img/SP-Logo.png" />
            </div>
            <div className="menu-top-header">
              <div>
                <img src="/img/SP-Icon-login.png" />
                <span>LOG IN</span>
              </div>
              <div>
                <img src="/img/SP-Icon-cart.png" />
                <span>CART</span>
              </div>
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
