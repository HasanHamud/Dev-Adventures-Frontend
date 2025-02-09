/* eslint-disable react/prop-types */

const CartItem = ({ course, onRemove }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-700">
      {/* Course Image */}
      <div className="w-24 h-24 bg-gray-700 flex-shrink-0">
        <img
          src="/api/placeholder/96/96"
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Details */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-100">{course.title}</h3>
        <p className="text-sm text-gray-400">By {course.instructor}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium text-gray-200">{course.rating}</span>
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(course.rating))}
            {"☆".repeat(5 - Math.floor(course.rating))}
          </div>
          <span className="text-gray-400">({course.reviews} ratings)</span>
        </div>

        <div className="flex gap-4 text-sm text-gray-400 mt-1">
          <span>{course.totalHours} total hours</span>
          <span>•</span>
          <span>{course.lectures} lectures</span>
          <span>•</span>
          <span>{course.level}</span>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          <span className="text-lg font-bold text-blue-500">
            ${course.price}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ${course.originalPrice}
          </span>
        </div>

        <button
          onClick={() => onRemove(course.id)}
          className="text-blue-500 hover:text-blue-400"
        >
          Remove
        </button>
        <button className="text-blue-500 hover:text-blue-400">
          Save for Later
        </button>
        <button className="text-blue-500 hover:text-blue-400">
          Move to Wishlist
        </button>
      </div>
    </div>
  );
};
export default CartItem;
