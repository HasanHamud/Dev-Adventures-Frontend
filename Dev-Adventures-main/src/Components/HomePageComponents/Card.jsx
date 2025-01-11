import "../../../src/index.css";

// eslint-disable-next-line react/prop-types
function Card({ url, title, description }) {
    return (
        <div className="text-yellow-500 mt-5 flex flex-col w-64 h-64 border border-yellow-500 rounded-lg overflow-hidden space-y-4 bg-gray-700 hover:bg-yellow-500 hover:text-gray-700">
            <div> 
                <img
                    alt="Plan Name"
                    src={url}
                    className="w-24 h-24 object-cover mx-auto my-4"
                />
            </div>
            <h2 className="text-center text-xl">{title}</h2>
            <p className="text-center">{description}</p>
        </div>
    );
}

export default Card;
