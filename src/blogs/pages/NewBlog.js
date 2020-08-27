import React, { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators"
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook"
import Button from "../../shared/components/FormElements/Button";
import "./BlogForm.css";

const NewBlog = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
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

    const history = useHistory();

    const blogSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:3001/api/blogs`,
                "POST",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    creator: auth.userId,
                }),
                {
                    Authorization: "Bearer " + auth.token,
                    "Content-Type": "application/json",
                }
            );
            history.push("/");
        } catch (err) { }
    };
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="blog-form" onSubmit={blogSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(1)]}
                    errorText="Please enter a description"
                    onInput={inputHandler}
                />

                <Button type="submit" disabled={!formState.isValid}>
                    Add Blog
            </Button>
            </form>
        </>
    );
};

export default NewBlog;
