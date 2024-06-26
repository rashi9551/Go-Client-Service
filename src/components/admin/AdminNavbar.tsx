import React from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLgout } from "../../service/redux/slices/adminAuthSlice";
import { Button, Collapse, Navbar, IconButton, Typography  } from "@material-tailwind/react";


export function AdminNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal"placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <p
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center cursor-pointer">
          Dashboard
        </p>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <p
          onClick={() => navigate("/admin/drivers")}
          className="flex items-center cursor-pointer">
          Drivers
        </p>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="p-1 font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <p
          onClick={() => navigate("/admin/users")}
          className="flex items-center cursor-pointer">
          Users
        </p>
      </Typography>
    </ul>
  );

  return (
    <>
    
    <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 bg-indigo-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <div className="container mx-auto flex items-center justify-between text-white">
        <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Admin Dashboard
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        <Button onClick={() => {
            dispatch(adminLgout());
            navigate('/admin/login');
          } } variant="gradient" size="sm" className="hidden lg:inline-block"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <span>LOG OUT</span>
        </Button>
        <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={() => setOpenNav(!openNav)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  {openNav ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )}
</IconButton>

      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          <Button
              onClick={() => {
                localStorage.removeItem("adminToken")
                navigate('/admin/login');
              } }
              variant="gradient" size="sm" fullWidth className="mb-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <span>LOG OUT</span>
          </Button>
        </div>
      </Collapse>
    </Navbar>
    </>
  );
}