"use client";

import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, ReactNode, FC } from "react";
import Image from 'next/image';
import Link from 'next/link';
import mouvStockIcon from "../public/images/MouvStockLogo.svg";

interface SidebarContextProps {
  expanded: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r border-blue-200 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={mouvStockIcon}
              alt="Logo"
              width={50}
              height={32}
              className={`transition-all duration-300 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            />
            {expanded && (
              <span className="ml-3 text-[#3250c8] font-semibold text-lg transition-opacity duration-300">
                MouvStock
              </span>
            )}
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            {expanded ? <ChevronFirst className="text-blue-600" /> : <ChevronLast className="text-blue-600" />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, activeItem, setActiveItem }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-blue-200 flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=bfdbfe&color=1e40af&bold=true"
            alt="Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-blue-900">John Doe</h4>
              <span className="text-xs text-blue-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical className="text-blue-600" size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  alert?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, href, alert = false }) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('SidebarItem must be used within a Sidebar');
  }

  const { expanded, activeItem, setActiveItem } = context;

  return (
    <li>
      <Link href={href} passHref>
        <div
          onClick={() => setActiveItem(text)}
          className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${
              activeItem === text
                ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800"
                : "hover:bg-blue-50 text-gray-600"
            }
          `}
        >
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            {text}
          </span>
          {alert && (
            <div
              className={`absolute right-2 w-2 h-2 rounded bg-blue-400 ${
                expanded ? "" : "top-2"
              }`}
            />
          )}

          {!expanded && (
            <div
              className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-blue-100 text-blue-800 text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
            >
              {text}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export { Sidebar, SidebarItem };
