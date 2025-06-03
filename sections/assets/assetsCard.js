const AssetCard = ({ asset }) => {
  const {
    name,
    assetId,
    category,
    assignedTo,
    createdAt,
    department,
    status,
    image,
  } = asset;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white w-[360px] flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        <img
          src={image || "/images/avatar.jpg"}
          alt={name}
          className="h-10 w-10 rounded border-gray-200 shadow-lg object-cover border"
        />
        <div className="flex flex-col">
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-gray-500">#{assetId}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-2 mt-3">
        <div>
          <p className="text-gray-400 text-xs">Category</p>
          <p className="font-medium text-lg">{category}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Assigned To</p>
          <p className="font-medium text-lg">{assignedTo}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Created</p>
          <p className="font-medium text-lg" >{new Date(createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Department</p>
          <p className="font-medium text-lg">{department}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Status</p>
          <p className="font-medium text-lg">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
