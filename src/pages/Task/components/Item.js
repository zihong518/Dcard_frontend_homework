import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const Item = ({ item, setModalItem, changeModelItemRef }) => {
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
  function setModal() {
    console.log(123)
    changeModelItemRef.current = true
    setModalItem(item)
  }
  return (
    <div
      className="py-5 px-10 bg-white shadow-gray-300 shadow rounded my-3"
      onClick={() => setModal()}
    >
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
      <ReactMarkdown
        children={item.body}
        className="mt-5 max-h-40 overflow-y-hidden"
        remarkPlugins={[remarkGfm]}
        style={multilineEllipsis}
      ></ReactMarkdown>
      {/* <div className="mt-5 " style={multilineEllipsis}>
        {item.body}
      </div> */}
    </div>
  )
}

export default Item
