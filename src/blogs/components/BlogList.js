import React from "react";
import Card from "../../shared/components/UIElements/Card";
import BlogItem from "./BlogItem";
import Button from "../../shared/components/FormElements/Button";
import "./BlogList.css";

const BlogList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="blog-list center">
                <Card>
                    <h2>No Blogs found</h2>
                    <Button to="/blogs/new">Share your Blog</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="blog-list">
            {props.items.map((blog) => (
                <BlogItem
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    description={blog.description}
                    creatorId={blog.creator}
                    onClick={props.onDeleteBlog}
                />
            ))}
        </ul>
    );
};

export default BlogList;
