export const VideoBox = ({ youtubeUrl }) => {
  if (!youtubeUrl) return null;
  const videoId =
    youtubeUrl.split("v=")[1]?.split("&")[0] ||
    youtubeUrl.split("youtu.be/")[1];
  if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;
  return (
    <div className="relative w-[811px] h-[385px] bg-gray-900 rounded-lg">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};