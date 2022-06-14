import React, { useEffect } from "react";
import styled from "styled-components";
import HomeBanner from "module/home/HomeBanner";
import Layout from "components/layout/Layout";
import HomeFeature from "module/home/HomeFeature";
import HomeNewest from "module/home/HomeNewest";

const HomePageStyles = styled.div``;

const HomePage = () => {
  useEffect(() => {
    document.title = "Monkey Blogging - Homepage";
  }, []);

  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
