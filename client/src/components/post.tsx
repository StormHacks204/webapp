/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

type PostProps = {
    username: string;
    imageId: string;
    caption: string;
    title: string;
    date: string;
};

const Post: React.FC<PostProps> = ({ username, imageId, caption, title, date }) => {
    const {getToken} = useAuth();

    const [image, setImage] = React.useState<File | null>(null);

    async function fetchPostImage(imageId: string) {
        const token = await getToken();
       const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts/image/${imageId}`, 
            {headers: 
                {Authorization: `${token}`}
            }
        );

        const blob = await response.blob();

        setImage(new File([blob], imageId, {
            type: blob.type,
        }));
        
    }

    useEffect (() => {
        if (imageId) {
            fetchPostImage(imageId);
        }
    }, [imageId]);

    
    return(
        <div className="flex justify-center my-10">
            <div className="border-1 p-4 rounded-lg shadow-md sm:w-[600px] w-[90%] max-w-[600px] bg-white">
                <div className="flex items-center mb-[12px] text-black">
                    {/* <img className="w-[50px] h-[50px] rounded-full mr-[12px]" src={profilePicture} alt="Profile Picture" /> */}
                    <span className="font-bold">User: {username}</span>
                    
                </div>
                <div className="body">
                    {imageId ? (
                        <>
                            {image && <img className="w-full mt-[16px] mr-[12px]" src={URL.createObjectURL(image)} alt="Content" />}
                            <h3 className="my-[8px] text-sm font-semibold">{title}</h3>
                            <p className="text-xs text-[#555]">{caption}</p>
                            <p className="text-xs text-[#888]">{date.split('T')[0]}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="my-[8px] text-sm font-semibold">{title}</h3>
                            <p className="text-xs text-[#555]">{caption}</p>
                            <p className="text-xs text-[#888]">{date.split('T')[0]}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Post;
