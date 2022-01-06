import React from "react";
import { FullpageBaseExperimental } from "../components/fullpages/fullpage-base-experimental/fullpage-base-experimental";
import Layout from "../components/layout";

// const About: React.FC = () => {
//   return (
//     <Layout>
//       <h3>About</h3>
//     </Layout>
//   );
// };

const About: React.FC = () => {
  return (
    <>
      <h3>About</h3>
      <FullpageBaseExperimental direction={"vertical"}>
        <div>
          <h3>HALLO</h3>
        </div>
        <div>
          <h3>HALLI</h3>
        </div>
        <div>
          <h3>HALLU</h3>
        </div>
      </FullpageBaseExperimental>
    </>
  );
};

export default About;
