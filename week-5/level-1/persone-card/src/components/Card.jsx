const Card = () => {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-gray-100 ">
      <div className="w-[40vh] h-[35vw] rounded-3xl shadow-xl bg-white flex flex-col text-4xl font-bold text-gray-600 overflow-hidden">
        <div className="flex justify-center items-center h-[20%]">
          Sushil Kumar
        </div>
        <div className="bg-gray-700 h-full ">
          <div className="h-[30%] flex justify-center items-center">
            <img
              src="https://avatars.githubusercontent.com/u/154815993?s=400&u=b116a302dc42175b08f81a37bab32d56bf932c14&v=4"
              className="w-[50%] rounded-full"
            />
          </div>
          <div className="text-xl">
            Hello, I am a Sushil Kumar A passionate Full-Stack developer from
            India
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Card;
