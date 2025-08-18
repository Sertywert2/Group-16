const ServiceCard = ({ service, onClick }) => (
  <div
    onClick={onClick}
    className="card p-1 cursor-pointer hover:bg-[var(--card-bg)]"
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onClick()}
    aria-label={`Select ${service.name}`}
  >
    <h3 className="font-bold text-[var(--text)]">{service.name}</h3>
    <p className="text-[var(--text)]">{service.description}</p>
    {service.files?.map((file, i) => (
      <a key={i} href={`/uploads/services/${file.filename}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
        {file.originalname}
      </a>
    ))}
  </div>
);

export default ServiceCard;