// eslint-disable-next-line react/prop-types
function Level({ title, feature1, feature2, feature3 }) {
    return (
        <div className="text-white mt-5 flex flex-col w-1/4 h-64 shadow-md  rounded-lg overflow-hidden space-y-4 bg-gray-700 hover:bg-blue-500 hover:text-white">
            <h1 className="text-3xl text-center pt-3">{title}</h1>
            <div>
                <ul className="list-disc">
                    <li className="text-xl m-6">{feature1}</li>
                    <li className="text-xl m-6">{feature2}</li>
                    <li className="text-xl m-6">{feature3}</li>
                </ul>
            </div>
        </div>
    );
}

export default Level;