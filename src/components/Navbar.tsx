import React, { useState, useEffect } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
  Bars2Icon,
  DocumentIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// Profile Menu component
type ProfileMenuItem = {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
};

function ProfileMenu({ handleLogout }: { handleLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const closeMenu = () => setIsMenuOpen(false);

  const profileMenuItems: ProfileMenuItem[] = [
    { label: "Sign Out", icon: PowerIcon, onClick: handleLogout },
  ];

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, onClick }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => {
                closeMenu();
                if (onClick) onClick();
              }}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// Nav List component
type NavListItem = {
  label: string;
  icon: React.ElementType;
  link: string;
};

const navListItems: NavListItem[] = [
  { label: "Create Article", icon: DocumentIcon, link: "/createArticle" },
  { label: "Statistic", icon: ChartBarIcon, link: "/statistic" },
];

function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon, link }) => (
        <Typography
          key={label}
          as="a"
          href={link}
          variant="small"
          color="gray"
          className="font-medium text-[#ffff]"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            <span className="text-[#ffffff]"> {label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    });
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/", { replace: true }); // Use replace to avoid history stack issues
  };

  return (
    <>
      <Navbar className="mx-auto max-w-screen-xl bg-[#000000] p-2 lg:rounded-full lg:pl-6 fixed w-full z-10 top-0 mt-[40px]">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="/homePage"
            className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-[#ffff]"
          >
            Travel Article
          </Typography>
          {/* NavList and ProfileMenu hidden on small screens */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <NavList />
            <ProfileMenu handleLogout={handleLogout} />
          </div>
          {/* Burger Icon visible only on small screens */}
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
        </div>
        {/* Mobile Nav visible only on small screens */}
      </Navbar>

      <MobileNav
        open={isNavOpen}
        className="lg:hidden absolute left-0 w-full bg-[#000000] shadow-lg mt-[-40px]"
      >
        <div className="p-4">
          <NavList />
          <div className="mt-4">
            <ProfileMenu handleLogout={handleLogout} />
          </div>
        </div>
      </MobileNav>
    </>
  );
}