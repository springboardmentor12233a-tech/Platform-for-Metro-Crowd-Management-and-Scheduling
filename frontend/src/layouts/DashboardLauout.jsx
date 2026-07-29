import { useState } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 75;

const DashboardLayout = ({ children }) => {

    const [open, setOpen] = useState(true);

    const toggleSidebar = () => {
        setOpen((prev) => !prev);
    };

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
                overflowX: "hidden",
                backgroundColor: "#0F172A",
  }}
>

            <Sidebar
                open={open}
                toggleSidebar={toggleSidebar}
            />

            <Box
  sx={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",

    ml: open ? `${EXPANDED_WIDTH}px` : `${COLLAPSED_WIDTH}px`,

    transition: "margin-left .3s ease",

    overflowX: "hidden",
  }}
>
                <Navbar toggleSidebar={toggleSidebar} />

                <Box
                    sx={{
                        flex: 1,
                        p: 3,
                    }}
                >

                    {children}

                </Box>

            </Box>

        </Box>

    );

};

export default DashboardLayout;