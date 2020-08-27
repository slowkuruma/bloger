import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./BlogForm.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";

const UpdateBlog = (props) => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedBlog, setLoadedBlog] = useState();
    const blogId = useParams().blogId;
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:3001/api/blogs/${blogId}`);
                setLoadedBlog(responseData.blog);
                setFormData(
                    {
                        title: {
                            value: responseData.blog.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.blog.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) { }
        };
        fetchBlog();
    }, [sendRequest, blogId, setFormData]);

    const blogUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:3001/api/blogs/${blogId}`,
                "PUT",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            history.push("/" + auth.userId + "/blogs");
        } catch (err) { }
    };

    if (!loadedBlog && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find Blog</h2>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="blog-form" onSubmit={blogUpdateSubmitHandler}>
                <Input
                    id="title"
                    elements="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE]}
                    errorText="Please enter a title"
                    onInput={inputHandler}
                    initialValue={loadedBlog.title}
                    initialValid={true}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH]}
                    errorText="Please enter a description"
                    onInput={inputHandler}
                    initialValue={loadedBlog.title}
                    initialValid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE BLOG
            </Button>
            </form>
        </>
    );
};

export default UpdateBlog;


