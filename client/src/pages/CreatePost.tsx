import React, { useEffect, useState } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

interface PostData {
  title: string;
  text: string;
  image: File | null;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData>({ title: '', text: '', image: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState({ latitude: 0 , longitude: 0});
  const [error, setError] = useState("Error");

  const {getToken} = useAuth();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
              default:
                setError("An error occurred.");
            }
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
    getLocation()

  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPost({ ...post, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // todo: change this based on what the backend imp is
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(post);

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('text', post.text);
    formData.append('date', new Date().toISOString());
    formData.append('coordinates', JSON.stringify([location.latitude, location.longitude]));

    
    if (post.image) {
      formData.append('image', post.image);
    }

    const token = await getToken();
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `${token}`
      }
    })

    if (response.ok) {
      console.log("Post created successfully");
    } else {
      window.alert("Failed to create post");
      console.error("Failed to create post");
    }
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="text" className="block text-gray-700 font-medium mb-2">Text</label>
          <textarea
            id="text"
            name="text"
            value={post.text}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {imagePreview && (
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Image Preview:</h3>
            <img src={imagePreview} alt="Preview" className="w-48 h-auto rounded-lg shadow-lg" />
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
