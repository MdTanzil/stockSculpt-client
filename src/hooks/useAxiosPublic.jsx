import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "http://localhost:3000/api/",
  // baseURL: 'https://stock-sculpt-server.vercel.app'
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
