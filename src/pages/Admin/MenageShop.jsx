import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const MenageShop = () => {
    const axiosSecure = useAxiosSecure()
    const {data:shops} = useQuery({queryKey:['all-shops'], queryFn:  async()=>{
        const res = await axiosSecure.get('/shops')
        return res.data
    }})
    // console.log(shops);
    const sendNotice = async (email) => {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Notice",
          inputPlaceholder: "Type your notice here...",
          inputAttributes: {
            "aria-label": "Type your message here",
          },
          showCancelButton: true,
        });
        if (text) {
            axiosSecure.post(`/send-email`,{to : email,"subject": "Notice from StockSculpt",text: text})
            .then(res =>{
                if (res.data.success) {
                    Swal.fire('Email send successFully');
                }
            })
          
        }
      };
    return (
        <div>
            <h2 className="text-center text-4xl text-primary">Manage Your Store ({shops?.length})</h2>
            <div className="mt-5">
        <div className="overflow-x-auto ">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Logo</th>
                <th>Shop Name</th>
                <th>Limit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="">
              {/* row 1 */}
              {shops?.map((shop, idx) => (
                <tr key={shop?._id} className="text-center text-lg ">
                  <td>{idx + 1}</td>
                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={shop?.shopLogo}
                            alt={shop?.name}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{shop?.shopOwnerName}</td>
                  <td>{shop?.limit}</td>
                  <td className="flex gap-1 justify-center items-center ">
                  
                      <button className="btn btn-xs bg-primary hover:bg-primary border-none text-white" onClick={()=>sendNotice(shop.shopOwnerEmail)}>
                        Send Notice
                      </button>
                  
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
    );
};

export default MenageShop;