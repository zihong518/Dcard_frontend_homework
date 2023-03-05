const Item = ({ item }) => {
  //   console.log(fetchData)
  const multilineEllipsis = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "5",
    overflow: "hidden",
  }
  function getStatusBackground(status) {
    if (status === "Open") {
      return "bg-green-100"
    } else if (status === "In Progress") {
      return "bg-yellow-100"
    } else if (status === "Done") {
      return "bg-red-100"
    } else {
      return "bg-blue-100"
    }
  }
  return (
    <div className="py-5 px-10 bg-white shadow-gray-300 shadow rounded my-3">
      <div className=" border-b-2 pb-3 ">
        {item.labels.map((label) => (
          <span
            key={label.node_id}
            className={`rounded-md px-2 py-1 text- ${getStatusBackground(
              label.name
            )}`}
          >
            {label.name}
          </span>
        ))}
        <h2 className="text-3xl mt-2 font-bold">{item.title}</h2>
      </div>
      <div className="mt-5 " style={multilineEllipsis}>
        {item.body}
      </div>
    </div>
  )
}

export default Item
