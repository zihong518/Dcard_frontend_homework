const Item = ({ item }) => {
  //   console.log(fetchData)
  const multilineEllipsis = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "5",
    overflow: "hidden",
  }

  return (
    <div className="py-5 px-10 bg-white shadow-gray-300 shadow rounded mt-3">
      <div className="text-3xl font-bold border-b-2 pb-3 ">
        <h2>{item.title}</h2>
        <div></div>
      </div>
      <div className="mt-5 " style={multilineEllipsis}>
        {item.body}
      </div>
    </div>
  )
}

export default Item
