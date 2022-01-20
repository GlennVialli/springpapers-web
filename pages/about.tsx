import React from "react";
import Layout from "../components/layout";
import { useFullPage } from "../hooks/fullpage_hooks/useFullPage";

// const About: React.FC = () => {
//   return (
//     <Layout>
//       <h3>About</h3>
//     </Layout>
//   );
// };

const About: React.FC = () => {
  const { FullpageBase, fullpageBaseProps } = useFullPage();
  return (
    <>
      <h3>About</h3>
      <FullpageBase {...fullpageBaseProps} orientation={"vertical"}>
        <div>
          <h3>HALLO</h3>
        </div>
        <div>
          <h3>HALLI</h3>
        </div>
        <div>
          <h3>HALLU</h3>
        </div>
      </FullpageBase>
    </>
  );
};

export default About;
