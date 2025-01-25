/* eslint-disable react/prop-types */
export default function CheckBox({ price }) {
  return (
    <div className="flex flex-col bg-gray-800 text-white w-64 h-48 rounded-md shadow-md">
      <div className="p-4">
        <p className="text-2xl font-bold mb-3"> Cart Summary </p>
        <div className="flex flex-row justify-between">
          <p className="text-md"> Subtotal: </p>
          <p className="text-md"> ${price} </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-md"> Discount: </p>
          <p className="text-md"> 0% </p>
        </div>
      </div>
      <div className="text-white px-4 mb-5 text-center my-2">
        <button className="bg-blue-500 rounded text-sm w-full p-3">
          {" "}
          Proceed to Check Out
        </button>
      </div>
    </div>
  );
}
