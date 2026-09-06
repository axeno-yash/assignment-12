import React from "react";
import { Link } from "react-router-dom";

function RedirectPath({ paths = [] }) {
  return (
    <nav className="px-4 lg:px-24 py-6 flex items-center gap-2 text-sm text-black/60 font-satoshi-regular">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        return (
          <React.Fragment key={index}>
            {path.to && !isLast ? (
              <Link to={path.to} className="hover:text-black transition-colors">
                {path.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>
                {path.label}
              </span>
            )}
            {!isLast && (
              <span className="text-black/40 mx-1">&gt;</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default RedirectPath;
