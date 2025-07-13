import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { ReactComponent as Logo } from "@/Presentation/assets/images/mainLogo.svg";

const TopNav = () => {
  const token = getCookie("access_token");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 w-full bg-white border-b-8 border-gray-300 flex items-center px-4 z-50 relative">
      <Link
        to="/presentations/home"
        className="flex items-center h-full shrink-0"
      >
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
                to="/presentations/profile"
                className="p-3 text-foreground font-semibold h-full flex items-center"
              >
                마이페이지
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center ml-auto gap-2">
        {!token && (
          <button
            className="ml-2 w-20 h-9 px-0 py-0 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all text-sm whitespace-nowrap flex items-center justify-center"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        )}
        <button
          className="flex flex-col justify-center items-center w-8 h-8 lg:hidden"
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
        >
          <span className="block w-5 h-0.5 bg-black mb-1 rounded transition" />
          <span className="block w-5 h-0.5 bg-black mb-1 rounded transition" />
          <span className="block w-5 h-0.5 bg-black rounded transition" />
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <nav
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transition-transform duration-300 lg:hidden
          ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
          style={{ willChange: "transform" }}
          onClick={(e) => e.stopPropagation()}
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
