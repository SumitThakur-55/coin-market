import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import WalletDetail from "./WalletDetail";

const Navbar = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const location = useLocation(); // Access the current path

    const handleNavbarToggle = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const getLinkClasses = (path: string) => {
        return location.pathname === path
            ? "block py-2 px-3 text-blue-700 bg-transparent md:p-0 dark:text-blue-500"
            : "block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 p-2">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-8"
                        alt="Flowbite Logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Coin Market
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={handleNavbarToggle}
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isNavbarOpen ? "true" : "false"}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>

                <div
                    className={`w-full md:block md:w-auto transition-all duration-300 ease-in-out ${isNavbarOpen ? "block" : "hidden"}`}
                    id="navbar-default"
                >
                    <ul className="font-medium text-xl flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link
                                to="/"
                                className={getLinkClasses("/")}
                                aria-current="page"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cryptocurrencies"
                                className={getLinkClasses("/cryptocurrencies")}
                            >
                                Cryptocurrencies
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/learn"
                                className={getLinkClasses("/learn")}
                            >
                                Learn
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/wallet"
                                className={getLinkClasses("/wallet")}
                            >
                                Wallet
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
