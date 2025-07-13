import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { ReactComponent as Logo } from "@/Presentation/assets/images/mainLogo.svg";

const TopNav = () => {
  const token = getCookie("access_token");
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 w-full bg-white border-b border-[#BCBCBC] flex items-center px-4 z-50 relative">

      <Link to="/home" className="flex items-center h-full shrink-0">
        <Logo className="scale-[90%]" />
      </Link>

      <NavigationMenu className="h-16 flex-1 hidden lg:flex items-center ml-4">
        <NavigationMenuList className="flex items-center">
          <NavigationMenuItem>
            <Link
              to="/presentations/home"
              className="p-3 text-foreground font-semibold h-full flex items-center"
            >
              모아보기
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/presentations/register"
              className="p-3 text-foreground font-semibold h-full flex items-center"
            >
              신청하기
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/presentations/about"
              className="p-3 text-foreground font-semibold h-full flex items-center"
            >
              수요지식회란?
            </Link>
          </NavigationMenuItem>
          {token && (
            <NavigationMenuItem>
              <Link
                to="/profile"
                className="p-3 text-foreground font-semibold h-full flex items-center"
              >
                마이페이지
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* PC에서 오른쪽 공간 확보용 (햄버거 가려지지 않게) */}
      <div className="hidden lg:block w-10" />

      {/* 모바일 햄버거 (lg 미만) */}
      <button
        className="flex flex-col justify-center items-center w-10 h-10 lg:hidden ml-auto"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
      >
        <span className="block w-7 h-0.5 bg-black mb-1 rounded transition" />
        <span className="block w-7 h-0.5 bg-black mb-1 rounded transition" />
        <span className="block w-7 h-0.5 bg-black rounded transition" />
      </button>

      {/* 모바일 메뉴 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 모바일 슬라이드 메뉴 */}
      {open && (
        <nav
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transition-transform duration-300 lg:hidden
          ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
          style={{ willChange: "transform" }}
          onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 시 오버레이로 전파 방지
        >
          <button
            className="self-end m-4 w-8 h-8 flex items-center justify-center"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <line
                x1="5"
                y1="5"
                x2="19"
                y2="19"
                stroke="#111"
                strokeWidth="2"
              />
              <line
                x1="19"
                y1="5"
                x2="5"
                y2="19"
                stroke="#111"
                strokeWidth="2"
              />
            </svg>
          </button>
          <ul className="flex flex-col gap-2 mt-4 px-6">
            <li>
              <Link
                to="/presentations/home"
                className="block py-3 text-lg font-semibold text-foreground"
                onClick={() => setOpen(false)}
              >
                모아보기
              </Link>
            </li>
            <li>
              <Link
                to="/presentations/register"
                className="block py-3 text-lg font-semibold text-foreground"
                onClick={() => setOpen(false)}
              >
                신청하기
              </Link>
            </li>
            <li>
              <Link
                to="/presentations/about"
                className="block py-3 text-lg font-semibold text-foreground"
                onClick={() => setOpen(false)}
              >
                수요지식회란?
              </Link>
            </li>
            {token && (
              <li>
                <Link
                  to="/presentations/profile"
                  className="block py-3 text-lg font-semibold text-foreground"
                  onClick={() => setOpen(false)}
                >
                  마이페이지
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default TopNav;
