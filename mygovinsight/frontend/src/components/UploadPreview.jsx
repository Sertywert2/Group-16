const UploadPreview = ({ files, onRemove }) => (
  <div className="grid grid-cols-2 gap-1 mt-1">
    {files.map((file, index) => (
      <div key={index} className="relative">
        {file.type.startsWith('image/') ? (
          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-16 object-cover rounded" />
        ) : (
          <video controls className="w-full h-16 object-cover rounded">
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
        )}
        <button
          onClick={() => onRemove(index)}
          className="absolute top-0 right-0 bg-[var(--error)] text-white rounded-full w-4 h-4 flex items-center justify-center"
          aria-label={`Remove ${file.name}`}
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

export default UploadPreview;