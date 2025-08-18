import { useState } from 'react';

const QuickActions = () => {
  const [filter, setFilter] = useState('');

  return (
    <div className="card p-1 mt-2 w-64">
      <h3 className="font-bold mb-1 text-[var(--text)]">Quick Actions</h3>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-1 border rounded mb-1 bg-[var(--card-bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
        placeholder="Filter"
        aria-label="Filter"
      />
      <button className="bg-[var(--primary)] text-[var(--onPrimary)] w-full p-1 rounded hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-[var(--primary)]">
        Invite User
      </button>
    </div>
  );
};

export default QuickActions;