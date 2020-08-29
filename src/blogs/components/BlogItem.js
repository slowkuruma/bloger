import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./BlogItem.css";

const BlogItem = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(`http://localhost:3001/api/blogs/${props.id}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                });
            props.onDelete(props.id);
        } catch (err) { }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="blog-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
        </Button>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
        </Button>
                    </>
                }
            >
                <p>Do you want to delete this blog?</p>
            </Modal>
            <li className="blog-item">
                <Card className="blog-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="blog-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.description}</h3>
                    </div>
                    <div className="blog-item__actions">
                        {auth.userId === props.creatorId && (
                            <Button to={`/blogs/${props.id}`}>EDIT</Button>
                        )}

                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default BlogItem;