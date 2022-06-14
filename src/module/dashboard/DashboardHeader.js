import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  .header-left {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .menu-toggle {
    padding: 8px 12px;
    font-size: 32px;
    cursor: pointer;
    border-radius: 12px;
    &:hover {
      background-color: ${(props) => props.theme.primary};
      background: #f1fbf7;
    }
    @media screen and (min-width: 1024px) {
      display: none;
    }
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 18px;
    font-weight: 600;
    img {
      max-width: 40px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
`;

const DashboardHeader = ({ onClick }) => {
  const { userInfo } = useAuth();

  return (
    <DashboardHeaderStyles>
      <div className="header-left">
        <i
          className="menu-toggle fa fa-bars"
          aria-hidden="true"
          onClick={onClick}
        ></i>
        <NavLink to="/" className="logo">
          <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
          <span className="hidden md:inline-block">Monkey Blogging</span>
        </NavLink>
      </div>
      <div className="header-right">
        <Button to="/manage/add-post" className="header-button" height="52px">
          Write new post
        </Button>
        <Link to="/profile" className="header-avatar">
          <img src={userInfo?.avatar} alt="" />
        </Link>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
