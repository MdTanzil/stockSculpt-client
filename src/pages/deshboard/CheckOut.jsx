import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";
const generatePDF = (invoice) => {
  // Create a new jsPDF instance
  const pdf = new jsPDF();

  // Add a title to the PDF
  pdf.text("Invoice", 14, 22);

  // Add content to the PDF using autoTable
  pdf.autoTable({
    startY: 30,
    head: [["id", "name", "Price", "Total"]],
    body: invoice.items.map((item) => [
      item.id,
      item.name,
      item.price,
      item.total,
    ]),
  });

  // Add total price
  pdf.text(`Total: ${invoice.total}`, 14, pdf.autoTable.previous.finalY + 10);

  // Save the PDF
  pdf.save("invoice.pdf");
};

const CheckOut = () => {
  const [data, setdata] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  useEffect(() => {
    axiosSecure.get(`/sale/${user.email}`).then((response) => {
      setdata(response.data);
    });
  }, [axiosSecure, user.email]);
  //   console.log(data);
  const handleGetPaid = () => {
  

    //   return <Pdf></Pdf>

    const it = data.map((d) => {
        return { id:  d.productId ,name :d.name ,price: d.sellingPrice}
    })
    console.log(it);
    const invoiceData = {
      items: it,
      total: 35,
    };
    generatePDF(invoiceData)

    const requests = data?.map((p) => {
        let ids = {
          productId: p.productId,
          saleId: p._id,
        };
  
        // Return the promise
        return axiosSecure.post(`/getpaid`, ids);
      });
      Promise.all(requests)
        .then((responses) => {
          // Handle responses here
          // console.log(responses);
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
        });
  };

  return (
    <div className="container mx-auto" id="checkout">
      <h2 className="text-center text-4xl text-primary">Check Out</h2>
      <div>
        <button className="btn btn-success text-left" onClick={handleGetPaid}>
          Get paid
        </button>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>id</th>
                <th>name</th>
                <th>selling price</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {data?.map((product, idx) => (
                <tr key={product._id}>
                  <th>{idx + 1}</th>
                  <td>{product.productId}</td>
                  <td>{product.name}</td>
                  <td>{product.sellingPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
