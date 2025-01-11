/* eslint-disable react/prop-types */
import  { forwardRef } from 'react';
import { useSnackbar } from 'notistack';

// eslint-disable-next-line react/display-name
const CustomSnack = forwardRef(({ id, message }, ref) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <div
      ref={ref}
      className="flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
    >
      <span className="font-semibold">{message}</span>
      <button
        onClick={() => closeSnackbar(id)}
        className="ml-4 text-lg font-bold hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
});

export default CustomSnack;
