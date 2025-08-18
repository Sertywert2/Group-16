const DataTable = ({ data = [] }) => (
  <div className="card overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-[var(--card-bg)]">
          <th className="p-1 text-left text-[var(--text)]">ID</th>
          <th className="p-1 text-left text-[var(--text)]">Rating</th>
          <th className="p-1 text-left text-[var(--text)]">Comment</th>
          <th className="p-1 text-left text-[var(--text)]">Files</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan="4" className="p-1 text-center text-[var(--text)]">No data available</td></tr>
        ) : (
          data.map((item, index) => (
            <tr key={index} className="hover:bg-[var(--card-bg)]">
              <td className="p-1 text-[var(--text)]">{index + 1}</td>
              <td className="p-1 text-[var(--text)]">{item.rating}</td>
              <td className="p-1 text-[var(--text)]">{item.comment}</td>
              <td className="p-1">
                {item.files?.map((file, i) => (
                  <a key={i} href={`/uploads/feedback/${file.filename}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                    {file.originalname}
                  </a>
                ))}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;