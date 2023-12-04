import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [images, setImages] = useState([]);
  const baseURL = "http://localhost:5038/api/";

  async function uploadHandler() {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("tags", tags);

    try {
      await axios.post(`${baseURL}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await getAllImages(); // Refresh all images after upload
      window.alert("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async function getAllImages() {
    try {
      const res = await axios.get(`${baseURL}search?tag=`);
      console.log("Fetched Images:", res.data); // Log fetched images
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching all images:", error);
    }
  }

  async function searchImages(tag) {
    try {
      const res = await axios.get(`${baseURL}search?tag=${tag}`);
      setImages(res.data);
    } catch (error) {
      console.error("Error searching images:", error);
    }
  }
  async function deleteImage(id) {
    try {
      await axios.delete(`${baseURL}delete?id=${id}`);
      await getAllImages(); // Refresh images after delete
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  useEffect(() => {
    // Fetch all images initially
    getAllImages();
  }, []);

  return (
    <div className="container">
      <h1>Image Gallery</h1>

      {/* Image Upload */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags (comma-separated)"
      />
      <button onClick={uploadHandler}>Upload</button>

      {/* Image Search */}
      <input
        type="text"
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        placeholder="Search images by tag"
      />
      <button onClick={() => searchImages(searchTag)}>Search</button>

      {/* Display Images in Grid */}
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img
              src={`http://localhost:5038/${image.imageUrl}`}
              alt={`Image ${index}`}
            />
            <p>Tags: {image.tags.join(", ")}</p>
            <button onClick={() => deleteImage(image._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
