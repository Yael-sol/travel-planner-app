import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { CurrentUser } from "./App";
import { fetchData } from "./fetchData";
import Delete from "./Delete";
import Update from "./Update";
import Add from './Add';
import '../style/Comments.css';
import { useLogOut } from './LogOut';

function Comments() {
    const logOut = useLogOut();
    const [comments, setComments] = useState("");
    const { post_id } = useParams();
    const { currentUser } = useContext(CurrentUser);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            setIsChange(0);
            try {
                await fetchData({
                    type: "comments",
                    params: { post_id },
                    method: "GET",
                    onSuccess: (comments) => {
                        setComments(comments);
                    },
                    onError: (error) => {
                        console.error(error);
                        setError("Failed to fetch comments");
                    },
                    logOut,
                });
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Failed to fetch comments");
            }
        };
        fetchComments();
    }, [post_id, isChange]);

    return (
        <>
            <div className='control'>
                <button onClick={() => navigate(`/users/${currentUser.id}/posts`)}>back to posts</button>
                <Add type={"comments"} setIsChange={setIsChange} inputs={["name", "body"]} setData={setComments} defaultValue={{ post_id: post_id, email: currentUser.email }} name="Add Comment" />
            </div>

            <div className='container'>
                <h1>Comments</h1>
                {comments.length > 0 ? (
                    <ul className='comments-list'>
                        {comments.map((comment) => (
                            <li className='comments-item' key={comment.id}>
                                <div className="comment-details">
                                    <h4>{comment.name}</h4>
                                    {comment.body}
                                </div>
                                <div className="comment-actions">
                                    {comment.email == currentUser.email && <Update type={"comments"} itemId={comment.id} setIsChange={setIsChange} inputs={["name", "body"]} />}
                                    {comment.email == currentUser.email && <Delete type={"comments"} itemId={comment.id} setIsChange={setIsChange} />}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Comments found.</p>
                )}
            </div>
        </>
    )
}

export default Comments;