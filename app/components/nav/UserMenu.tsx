'use client'


import { useCallback, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import Avatar from "../Avatar";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { SafeUser } from "@/types";

interface UserMenuProps {
    currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false); // Add state for admin login dialog

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const toggleAdminLogin = useCallback(() => {
        setShowAdminLogin(prev => !prev);
    }, []);

    const handleAdminLogin = () => {
        // Perform admin login logic here
        const email = prompt("Enter admin email:");
        const password = prompt("Enter admin password:");

        // Simulated login success for demonstration purposes
        const loginSuccess = email === "admin@gmail.com" && password === "admin123";

        if (loginSuccess) {
            // Redirect to admin page after successful login
            window.alert("Login successful!");
            toggleAdminLogin();
            window.location.href = "/admin";
        } else {
            window.alert("Invalid email or password. Please try again.");
        }
    };

    return (
        <>
            <div className="relative z-30">
                <div
                    onClick={toggleOpen}
                    className="
                        p-2
                        border-[1px]
                        border-slate-400
                        flex
                        flex-row
                        items-center
                        gap-1
                        rounded-full
                        cursor-pointer
                        hover:shadow-mdta
                        transition
                        text-slate-700
                    "
                >
                    <Avatar src={currentUser?.image} />
                    <AiFillCaretDown />
                </div>
                {isOpen && (
                    <div className="absolute
                        rounded-md
                        shadow-md
                        w-[170px]
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                        flex
                        flex-col
                        cursor-pointer"
                    >
                        {currentUser ? (
                            <div>
                                <Link href="/orders">
                                    <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                                </Link>
                                <MenuItem onClick={toggleAdminLogin}>Admin Dashboard</MenuItem> {/* Open admin login dialog */}
                                <hr />
                                <MenuItem
                                    onClick={() => {
                                        toggleOpen();
                                        signOut();
                                    }}
                                >
                                    LogOut
                                </MenuItem>
                            </div>
                        ) : (
                            <div>
                                <Link href="/login">
                                    <MenuItem onClick={toggleOpen}>Login</MenuItem>
                                </Link>
                                <Link href="/register">
                                    <MenuItem onClick={toggleOpen}>Register</MenuItem>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isOpen ? <BackDrop onClick={toggleOpen} /> : null}

            {/* Admin login dialog */}
            {showAdminLogin && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md">
                    <h2 className="text-lg font-bold mb-2">Admin Login</h2>
                    <button onClick={handleAdminLogin} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Login
                    </button>
                </div>
            )}
        </>
    );
};

export default UserMenu;
