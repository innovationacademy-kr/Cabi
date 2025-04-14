import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const TopNav = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="home">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              모아보기
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="register">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              신청하기
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="about">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              수요지식회란?
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="profile">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              마이페이지
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNav;
