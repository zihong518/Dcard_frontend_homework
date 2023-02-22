const Item = ({ item }) => {
  //   console.log(fetchData)
  return (
    <div className="mx-10 py-5 px-10 bg-white shadow-gray-300 shadow rounded mt-3">
      <div className="text-3xl font-bold border-b-2 pb-3 ">
        <h2>{item.title}</h2>
        <div></div>
      </div>
      <div className="mt-5">{item.body}</div>
    </div>
  )
}

export default Item
