import React, { useEffect, useState } from "react";
import { useParams } from "react-route-dom";
import BlogList from "../components/BlogList"
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserBlogs = () => {
    const [loadedBlogs, setLoadedBlogs] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const responseData = await sendRequest(`/api/blogs/user/${userId}`);
                setLoadedBlogs(responseData.blogs);
            } catch (err) { }
        };
        fetchBlogs();
    }, [sendRequest, userId]);

    const blogDeleteHandler = (deletedBlogId) => {
        setLoadedBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog.id !== deletedBlogId)
        );
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedBlogs && (
                <BlogList items={loadedBlogs} onDeleteBlogs={blogDeleteHandler} />
            )}
        </>
    );
};

export default UserBlogs;