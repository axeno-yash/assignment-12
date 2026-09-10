function AdminTable({ children, minWidth = "640px" }) {
  return (
    <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
      <table
        className="w-full text-left border-collapse"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }) {
  return (
    <thead>
      <tr className="border-b border-black/10 text-[11px] font-satoshi-bold uppercase tracking-wide text-black/50">
        {children}
      </tr>
    </thead>
  );
}

export default AdminTable;
