import useShop from "../../hooks/useShop";

const DeshboardHome = () => {
    const {data:userInfo,isLoading} = useShop()
    if (isLoading) {
        // TODO 
        return <><p>spin</p></>
    }
    return (
        <div className="container mx-auto ">
            {/* TODO  */}
            <h3>Total 6 product added {userInfo?.shopName}</h3>
        </div>
    );
};

export default DeshboardHome;