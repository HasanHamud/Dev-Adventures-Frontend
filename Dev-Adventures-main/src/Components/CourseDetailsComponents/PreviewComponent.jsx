/* eslint-disable react/prop-types */
export const PreviewSection = ({ youtubeUrl }) => {
  if (!youtubeUrl) return null;

  const videoId =
    youtubeUrl.split("v=")[1]?.split("&")[0] ||
    youtubeUrl.split("youtu.be/")[1];

  if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;

  return (
    <div className="relative bg-gray-700 h-96 rounded-lg flex items-center justify-center">
      <iframe
        className="rounded-lg"
        width="811"
        height="385"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="absolute top-4 left-4">
        <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
          InProgress
        </span>
      </div>
    </div>
  );
};
