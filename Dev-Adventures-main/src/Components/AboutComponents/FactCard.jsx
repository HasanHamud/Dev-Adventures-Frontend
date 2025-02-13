/* eslint-disable react/prop-types */
export default function FactCard({ title, content }) {
  return (
    <div className="border-t-4 border-t-blue-500 text-white flex flex-col mt-5 py-5 px-3 w-64 rounded-sm my-10">
      <div className="text-2xl ">
        <p>{title}</p>
      </div>

      <div className="text-md mt-5">
        <p>{content}</p>
      </div>
    </div>
  );
}
