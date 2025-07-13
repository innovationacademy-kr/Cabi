import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import { ReactComponent as Logo } from "@/Presentation/assets/images/mainLogo.svg";

const TopNav = () => {
  const token = getCookie("access_token");
  return (
    <header className="h-16 w-full bg-white border-b border-solid border-[#BCBCBC]">
      <NavigationMenu className="h-16 w-full">
        <NavigationMenuList>
          <Logo className="ml-6 scale-[90%]" />
          <NavigationMenuItem>
            <Link
              to="home"
              className="ml-3 p-3 text-black font-semibold h-full flex items-center"
            >
              모아보기
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="register"
              className="p-3 text-black font-semibold h-full flex items-center"
            >
              신청하기
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="about"
              className="p-3 text-black font-semibold h-full flex items-center"
            >
              수요지식회란?
            </Link>
          </NavigationMenuItem>
          {token && (
            <NavigationMenuItem>
              <Link
                to="profile"
                className="p-3 text-black font-semibold h-full flex items-center"
              >
                마이페이지
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
export default TopNav;
