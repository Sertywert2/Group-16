const ListItem = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="p-1 hover:bg-[var(--card-bg)] rounded cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onClick()}
    aria-label={`Select ${title}`}
  >
    <span className="text-[var(--text)]">{title}</span>
  </div>
);

export default ListItem;