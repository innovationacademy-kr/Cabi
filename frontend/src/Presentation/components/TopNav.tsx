import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const TopNav = () => {
  return (
    <NavigationMenu className="h-14">
      <NavigationMenuList className="h-14">
        <NavigationMenuItem className="ml-5">
          <Link
            to="home"
            className="p-3 text-foreground h-full flex items-center"
          >
            모아보기
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="register"
            className="p-3 text-foreground h-full flex items-center"
          >
            신청하기
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="about"
            className="p-3 text-foreground h-full flex items-center"
          >
            수요지식회란?
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="profile"
            className="p-3 text-foreground h-full flex items-center"
          >
            마이페이지
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default TopNav;
