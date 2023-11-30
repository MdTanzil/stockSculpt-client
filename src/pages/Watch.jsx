import YouTube from "react-youtube";

const Watch = () => {
    const opts = {
        height: '500',
        width: '1000',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
    return (
        <div className="container mx-auto my-10 w-full">
            <h2 className="text-center my-4 text-3xl font-semibold text-primary">Watch Tutorial </h2>
          <div className="flex justify-center">
          <YouTube videoId="DZhHSR4_9B4" opts={opts}  />;
          </div>
        </div>
    );
};

export default Watch;