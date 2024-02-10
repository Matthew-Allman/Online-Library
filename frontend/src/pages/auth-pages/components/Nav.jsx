import React from "react";
import { Link } from "react-router-dom";

const Nav = ({ items }) => {
  return (
    <section className="w-full h-[100px] mb-6 lg:mb-0">
      <div className="flex flex-row items-center justify-between w-full h-full px-5 lg:px-10">
        <Link to={"/"} className="h-[50px] text-[30px] font-bold">
          Online Library
        </Link>

        <span className="lg:flex flex-row items-center gap-x-2 text-gray hidden">
          {items.text && <p>{items.text}</p>}
          <Link
            className="border-b-[0.1px] border-lighGray"
            to={items.link.href}
          >
            {items.link.name}
          </Link>
        </span>
      </div>
    </section>
  );
};

export default Nav;
