import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Link, navigate, graphql, useStaticQuery } from "gatsby";
import { useColorMode } from "theme-ui";

import Section from "@components/Section";
import Logo from "@components/Logo";
import { LinkExternal } from "@components/LinkNav";

import Icons from "@icons";
import mediaqueries from "@styles/media";
import {
  getWindowDimensions,
  getBreakpointFromTheme,
} from "@utils";

const siteQuery = graphql`
  {
    sitePlugin(name: { eq: "@tantrongtt/gatsby-theme-trong" }) {
      pluginOptions {
        rootPath
        basePath
      }
    }
  }
`;

const DarkModeToggle: React.FC<{}> = () => {
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === `dark`;

  function toggleColorMode(event) {
    event.preventDefault();
    setColorMode(isDark ? `light` : `dark`);
  }

  return (
    <IconWrapper
      isDark={isDark}
      onClick={toggleColorMode}
      data-a11y="false"
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      <MoonOrSun isDark={isDark} />
      <MoonMask isDark={isDark} />
    </IconWrapper>
  );
};

const NavigationHeader: React.FC<{}> = () => {
  const [showBackArrow, setShowBackArrow] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string>("/");
  const { sitePlugin } = useStaticQuery(siteQuery);

  const [colorMode] = useColorMode();
  const fill = colorMode === "dark" ? "#fff" : "#000";
  const { rootPath, basePath } = sitePlugin.pluginOptions;

  useEffect(() => {
    const { width } = getWindowDimensions();
    const phablet = getBreakpointFromTheme("phablet");

    const prev = localStorage.getItem("previousPath");
    const previousPathWasHomepage =
      prev === (rootPath || basePath) || (prev && prev.includes("/page/"));
    const isNotPaginated = !location.pathname.includes("/page/");

    setShowBackArrow(
      previousPathWasHomepage && isNotPaginated && width <= phablet,
    );
    setPreviousPath(prev);
  }, []);

  return (
    <Section narrow>
      <NavContainer>
        <LogoLink
          to={rootPath || basePath}
          data-a11y="false"
          title="Navigate back to the homepage"
          aria-label="Navigate back to the homepage"
          back={showBackArrow ? "true" : "false"}
        >
          {showBackArrow && (
            <BackArrowIconContainer>
              <Icons.ChevronLeft fill={fill} />
            </BackArrowIconContainer>
          )}
          <Logo fill={fill} />
          <Hidden>Navigate back to the homepage</Hidden>
          <ArcTextWrap>
            <Icons.ArcTagline /> 
          </ArcTextWrap>
        </LogoLink>
        <NavControls>
          <NavLink to={`/writing`} title={`All articles`} activeClassName="active" >
            Write
          </NavLink>
          <NavLink to={`/books-for-product-designers`} title={`Book collection to read`} activeClassName="active" >
            Read
          </NavLink>
          <NavLink to={`/about`} title={`About me`} activeClassName="active" >
            Me
          </NavLink>
          <LinkTextWrap>
            <LinkExternal data-a11y="false" aria-label={`Blog Tiếng Việt`} href={`https://vi.trongnguyen.co`} >
              ★ VN
            </LinkExternal>
          </LinkTextWrap>
          {/* <DarkModeToggle /> */}
        </NavControls>
      </NavContainer>
    </Section>
  );
};

export default NavigationHeader;

const BackArrowIconContainer = styled.div`
  transition: 0.2s transform var(--ease-out-quad);
  opacity: 0;
  padding-right: 30px;
  animation: fadein 0.3s linear forwards;

  @keyframes fadein {
    to {
      opacity: 1;
    }
  }

  ${mediaqueries.desktop_medium`
    display: none;
  `}
`;

const NavContainer = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 24px;
`;

const NavLink = styled(Link)`
  font-weight: ${p => p.theme.fontsWeight.bold};
  font-family: ${p => p.theme.fonts.title};
  font-size: 14px;
  color: ${p => p.theme.colors.secondary};
  transition: color 0.25s var(--ease-in-out-quad);
  display: inline-block;
  position: relative;
  margin-left: 40px;

  ${mediaqueries.tablet`
    margin-left: 24px;
  `}

  &::after {
    background: none repeat scroll 0 0 transparent;
    bottom: -8px;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    background: ${p => p.theme.colors.accent};
    transition: width 0.25s ease 0s, left 0.25s ease 0s;
    width: 0;
  }

  &:hover {
    color: ${p => p.theme.colors.secondary};

    &::after {
      width: 100%; 
      left: 0; 
    }
  }

  &.active {
    &::after {
      background: none repeat scroll 0 0 transparent;
      bottom: -8px;
      content: "";
      display: block;
      height: 2px;
      left: calc(50% - 10px);
      position: absolute;
      background: ${p => p.theme.colors.accent};
      transition: width 0.25s ease 0s, left 0.25s ease 0s;
      width: 20px;
    }
  }
`;

const LinkTextWrap = styled.div`
  font-weight: ${p => p.theme.fontsWeight.bold};
  font-family: ${p => p.theme.fonts.title};
  color: ${p => p.theme.colors.secondary};
  font-size: 14px;
  margin-left: 40px;

  ${mediaqueries.phone`
    margin-left: 24px;
  `}
  
`;

const LogoLink = styled(Link)<{ back: string }>`
  position: relative;
  display: flex;
  align-items: center;
  left: 0;
  width: 120px;
  height: 144px;
  // background-color: ${p => p.theme.colors.accent};
  // box-shadow: 0px 7px 16px -12px rgba(104, 25, 8, 0.6);
  margin-top: 0;
  transition: transform 0.25s ease;

  ${mediaqueries.desktop_medium`
    left: 0
  `}

  ${mediaqueries.tablet`
    width: 88px;
    height: 120px;
  `}

  &[data-a11y="true"]:focus::after {
    content: "";
    position: absolute;
    left: -10%;
    top: -30%;
    width: 120%;
    height: 160%;
    border: 2px solid ${p => p.theme.colors.accent};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 5px;
  }

  &:hover {
    ${BackArrowIconContainer} {
      transform: translateX(-3px);
    }
    transform: translateY(12px);
  }
`;

const NavControls = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${mediaqueries.phablet`
    right: -5px;
  `}
`;

const ButtonExit = styled.button`
  margin-left: 10px;
`;

const IconWrapper = styled.button<{ isDark: boolean }>`
  opacity: 0.5;
  position: relative;
  border-radius: 5px;
  width: 40px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  margin-left: 30px;

  &:hover {
    opacity: 1;
  }

  &[data-a11y="true"]:focus::after {
    content: "";
    position: absolute;
    left: 0;
    top: -30%;
    width: 100%;
    height: 160%;
    border: 2px solid ${p => p.theme.colors.accent};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 5px;
  }

  ${mediaqueries.tablet`
    display: inline-flex;
    transform: scale(0.708);
    margin-left: 16px;


    &:hover {
      opacity: 0.5;
    }
  `}
`;

// This is based off a codepen! Much appreciated to: https://codepen.io/aaroniker/pen/KGpXZo
const MoonOrSun = styled.div<{ isDark: boolean }>`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: ${p => (p.isDark ? "4px" : "2px")} solid
    ${p => p.theme.colors.primary};
  background: ${p => p.theme.colors.primary};
  transform: scale(${p => (p.isDark ? 0.55 : 1)});
  transition: all 0.45s ease;
  overflow: ${p => (p.isDark ? "visible" : "hidden")};

  &::before {
    content: "";
    position: absolute;
    right: -9px;
    top: -9px;
    height: 24px;
    width: 24px;
    border: 2px solid ${p => p.theme.colors.primary};
    border-radius: 50%;
    transform: translate(${p => (p.isDark ? "14px, -14px" : "0, 0")});
    opacity: ${p => (p.isDark ? 0 : 1)};
    transition: transform 0.45s ease;
  }

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin: -4px 0 0 -4px;
    position: absolute;
    top: 50%;
    left: 50%;
    box-shadow: 0 -23px 0 ${p => p.theme.colors.primary},
      0 23px 0 ${p => p.theme.colors.primary},
      23px 0 0 ${p => p.theme.colors.primary},
      -23px 0 0 ${p => p.theme.colors.primary},
      15px 15px 0 ${p => p.theme.colors.primary},
      -15px 15px 0 ${p => p.theme.colors.primary},
      15px -15px 0 ${p => p.theme.colors.primary},
      -15px -15px 0 ${p => p.theme.colors.primary};
    transform: scale(${p => (p.isDark ? 1 : 0)});
    transition: all 0.35s ease;

    ${p => mediaqueries.tablet`
      transform: scale(${p.isDark ? 0.92 : 0});
    `}
  }
`;

const MoonMask = styled.div<{ isDark: boolean }>`
  position: absolute;
  right: -1px;
  top: -8px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 0;
  background: ${p => p.theme.colors.background};
  transform: translate(${p => (p.isDark ? "14px, -14px" : "0, 0")});
  opacity: ${p => (p.isDark ? 0 : 1)};
  transition: ${p => p.theme.colorModeTransition}, transform 0.45s ease;
`;

const Hidden = styled.span`
  position: absolute;
  display: inline-block;
  opacity: 0;
  width: 0px;
  height: 0px;
  visibility: hidden;
  overflow: hidden;
`;

const ArcTextWrap = styled.div`
  position: absolute;
  display: inline-block;
  width: 120px;
  height: 120px;
  bottom: 12px;
  left: 0;
  animation: rotation 20s infinite linear;
  
  ${mediaqueries.tablet`
    width: 80px;
    height: 80px;
    bottom: 22px;
  `}

`;
