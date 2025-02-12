import axios from "axios";

const url = `https://api.imgbb.com/1/upload?key=de14e2d75407d717a2f163638694044f`;

const imageUpload = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile); // Correct way to send file

    const res = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      return res.data.data.display_url; // Return image URL
    }
  } catch (error) {
    console.error(
      "Image upload failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

export default imageUpload;
