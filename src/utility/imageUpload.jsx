import useAxiosPublic from "../hooks/useAxiosPublic"

const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_hosting_apikey}`
const imageUpload= async(imageFile)=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const axios = useAxiosPublic()
    // console.log(url);
    // console.log(imageFile);
    const res = await  axios.post(url, {image: imageFile},{
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
    if (res.data.success) {
        return res.data.data.display_url
    }

    return false



}
export default imageUpload