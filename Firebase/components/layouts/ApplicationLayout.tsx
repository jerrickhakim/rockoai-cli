"use client";

// App
import app from "@/app.json";
import Image from "next/image";
import { User } from "firebase/auth";

// React
import { useEffect, useRef, useState } from "react";

// Next
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Framer
import { motion, AnimatePresence } from "framer-motion";

// Community Icons
import Icon from "@mdi/react";
import { mdiPinOutline } from "@mdi/js";
import { mdiPin, mdiMenu, mdiClose, mdiRun } from "@mdi/js";

// Icons
import clsx from "clsx";

// Firebase
import { logout } from "@/firebase/client";

// Hooks
import { useOnClickOutside, useWindowSize, useLocalStorage } from "usehooks-ts";

// Components
import AccountDropdown from "@/app/account/_components/AccountDropdown";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

// Types
interface Link {
  href: string;
  text: string;
  icon: React.ReactNode;
  tag?: string;
  visible: boolean;
}

interface ApplicationLayoutProps {
  children?: React.ReactNode;
  links?: Link[];
  name?: string;
  user?: User | null;
  floating?: boolean;
  iconLink?: string;
  appendSidebarContent?: React.ReactNode;
}

//
// ApplicationLayout
//

export default function ApplicationLayout({
  children = <></>,
  links = [],
  user = null,
  floating = true,
  iconLink = "/",
  appendSidebarContent = <></>,
}: ApplicationLayoutProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hooks
  const { width, height } = useWindowSize();

  const [pinned, setPinned] = useLocalStorage("pinned", false);

  links = links.filter((link) => link.visible);

  const sideBarRef = useRef<HTMLElement>(null);
  useOnClickOutside(sideBarRef as React.RefObject<HTMLElement>, () => {
    if (width < 900) setSideBarWidth(0);
  });

  // Router
  const router = useRouter();
  const pathname = usePathname();

  const sidebarWidth = floating ? 265 : 275;

  function getInitialWidth(): number {
    if (pinned && width > 900) {
      return 275;
    }
    if (!pinned && width > 900) {
      return 54;
    }

    if (width < 900) {
      return 0;
    }

    return 0; // Default case
  }

  const [sideBarWidth, setSideBarWidth] = useState<number>(getInitialWidth());

  useEffect(() => {
    window.localStorage.setItem("pinned", pinned.toString());
  }, [pinned]);

  //
  // Resize Observer & Pathname
  //

  useEffect(() => {
    if (width < 900) {
      setSideBarWidth(0);
    } else {
      pinned ? setSideBarWidth(sidebarWidth) : setSideBarWidth(54);
    }
  }, [width, pathname, pinned, sidebarWidth]);

  //
  // JSX - prevent hydration mismatch
  //

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {/* Right Sidebar */}
        <motion.aside
          ref={sideBarRef}
          aria-hidden={sideBarWidth < 54}
          key={"aside"}
          initial={{ y: 0, opacity: 0, x: -sideBarWidth }}
          animate={{
            y: 0,
            opacity: 1,
            x: 0,
            width: sideBarWidth,
          }}
          exit={{ y: 0, opacity: 0 }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.2,
          }}
          style={{
            height: floating && width > 900 ? height - 20 : height,
            width: sideBarWidth,
            zIndex: 90,
          }}
          className={clsx(
            floating
              ? "rounded-xl md:top-[10px] md:left-[10px]"
              : "border-border top-0 left-0 border-r",
            "bg-back bg-background fixed overflow-hidden",
          )}
          onMouseEnter={() => {
            // width > 900 ? setSideBarWidth(275) : null;
          }}
          onMouseLeave={() => {
            !pinned && width > 900 ? setSideBarWidth(54) : null;
          }}
        >
          {/* Header */}
          <header
            className="bg-background border-border flex h-[64px] items-center justify-between border-b pr-2"
            style={{
              width: sideBarWidth,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {sideBarWidth > 0 && (
              <>
                <div className="flex w-full items-center justify-between">
                  {sideBarWidth == 54 ? (
                    <>
                      <a href={iconLink}>
                        <Image
                          src={app ? app.icon : "/icon.png"}
                          className="ml-[7px] w-[40px] rounded"
                          alt={`${app?.name}'s Icon`}
                          width={40}
                          height={40}
                        />
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between space-x-3 overflow-hidden">
                        <Link href={iconLink}>
                          <Image
                            src={app.icon}
                            className="ml-[6px] w-[40px] rounded"
                            alt={`${app.name || app.name}'s Icon`}
                            width={40}
                            height={40}
                          />
                        </Link>

                        <div className="text-dark dark:text-light flex items-center overflow-hidden text-lg font-bold tracking-tight">
                          <span className="truncate">{app.name}</span>
                        </div>
                      </div>

                      {width > 900 ? (
                        <button
                          onClick={() => setPinned(!pinned)}
                          aria-label={pinned ? "Pin Sidebar" : "Unpin Sidebar"}
                        >
                          <Icon
                            path={pinned ? mdiPin : mdiPinOutline}
                            size={1}
                            className="rotate-45"
                          />
                        </button>
                      ) : (
                        <button
                          aria-label="Close Sidebar"
                          onClick={() => {
                            setSideBarWidth(0);
                          }}
                        >
                          <Icon path={mdiClose} size={1} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </header>

          {/* Content */}
          <div
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              height: !floating ? height - 172 : height - 192,
            }}
          >
            <div className="flex h-full w-full flex-col justify-center py-3 text-center">
              <div className="h-full p-[5px]">
                <nav>
                  {links.map(({ href, text, icon, tag }, index) => {
                    const HTMLLink: React.FC<
                      React.AnchorHTMLAttributes<HTMLAnchorElement>
                    > = ({ children, ...props }) => {
                      return <a {...props}>{children}</a>;
                    };
                    const Components = tag === "a" ? HTMLLink : Link;

                    const active =
                      (pathname.includes(href) && index !== 0) ||
                      (index === 0 && pathname === links[0].href);

                    return (
                      <Components
                        className={clsx(
                          "mb-4 flex h-[40px] min-w-[200px] items-center whitespace-nowrap",
                          active && sideBarWidth > 54
                            ? "from-primary rounded-lg bg-gradient-to-r text-white"
                            : "",
                        )}
                        href={href}
                        key={href}
                        aria-label={text}
                        prefetch={tag === "a" ? undefined : true}
                      >
                        <div className={clsx("flex w-full items-center")}>
                          <motion.span
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.3 },
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={clsx(
                              "not-sr-only mt-[7px] mr-[7px] mb-[7px] ml-[2px] flex h-[40px] w-[40px] items-center justify-center rounded-lg",
                              active && sideBarWidth <= 54
                                ? "bg-primary text-white"
                                : "",
                            )}
                            aria-hidden="true"
                          >
                            {icon}
                          </motion.span>
                          <span
                            className={clsx(
                              "text-md tracking-light ml-1 font-medium",
                            )}
                          >
                            {text}
                          </span>
                        </div>
                      </Components>
                    );
                  })}
                </nav>
              </div>
              {sideBarWidth > 54 ? (
                <div className="p-2">{appendSidebarContent}</div>
              ) : null}
            </div>
          </div>

          <div className="h-[108px] items-center justify-between">
            <div className="flex w-[54px] items-center justify-center py-3 text-center">
              <ThemeSwitcher />
            </div>

            <div className="border-border border-t">
              <button
                className="flex h-[54px] min-w-[200px] items-center overflow-hidden py-3"
                onClick={async () => {
                  await logout();
                  router.push("/auth/login");
                }}
                aria-label="Logout of your account"
              >
                <div className="flex w-[54px] items-center justify-center text-gray-600 dark:text-gray-200">
                  <Icon path={mdiRun} size={1} />
                </div>
                <div className="tracking-light text-sm text-gray-600 dark:text-gray-200">
                  Logout
                </div>
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence initial={false}>
        <motion.div
          key={"content"}
          initial={{ y: 0, opacity: 0, paddingLeft: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            paddingLeft:
              width < 900 ? 0 : floating ? sideBarWidth + 10 : sideBarWidth,
          }}
          exit={{ y: 0, opacity: 0 }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.2,
          }}
          style={{
            touchAction: width < 900 && sideBarWidth > 0 ? "none" : "auto",
            height: "100%",
          }}
        >
          <header
            style={{
              height: "64px",
            }}
            className={clsx(
              floating
                ? "top-0 md:top-[10px] md:ml-[10px] md:w-[calc(100%-20px)] md:rounded-xl"
                : "border-border top-0 border-b",
              "sticky z-20 px-2",
            )}
          >
            <div className="flex h-[64px] items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <button
                  aria-label={
                    sideBarWidth >= sidebarWidth
                      ? "Close Sidebar"
                      : "Open Sidebar"
                  }
                  onClick={() => {
                    const newWidth = width < 900 ? 0 : 54;

                    setSideBarWidth(
                      sideBarWidth === 54 || sideBarWidth === 0
                        ? sidebarWidth
                        : newWidth,
                    );
                    setPinned(!pinned);
                  }}
                  className="h-[50px] w-[48px]"
                >
                  {sideBarWidth >= sidebarWidth ? (
                    <Icon path={mdiClose} size={1} />
                  ) : (
                    <Icon path={mdiMenu} size={1} />
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-8">
                <AccountDropdown />
              </div>
            </div>
          </header>

          <main
            style={{
              marginTop: floating ? 10 : 0,
            }}
          >
            {children}
          </main>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
