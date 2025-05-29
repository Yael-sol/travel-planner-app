import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentUser } from './App';
import { fetchData } from './fetchData';
import Search from './Search';
import Sort from './Sort';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import '../style/Posts.css';
import { useLogOut } from './LogOut';

function Posts() {
    const logOut = useLogOut();
    const [userPosts, setUserPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [isAllPost, setIsAllPosts] = useState(1);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const [displayDetails, setDisplayDetails] = useState(null);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            setError("User is not logged in");
            return;
        }
        fetchData({
            type: "posts",
            params: { user_id: 'null' },
            onSuccess: (data) => setUserPosts(data),
            onError: (err) => setError(`Failed to fetch posts: ${err}`),
            logOut,
        });
    }, [currentUser.id, isChange]);

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            setError("User is not logged in");
            return;
        }
        fetchData({
            type: "posts",
            onSuccess: (data) => setAllPosts(data),
            onError: (err) => setError(`Failed to fetch posts: ${err}`),
            logOut,
        });
    }, [isChange]);

    useEffect(() => {
        setDisplayData(isAllPost == 0 ? userPosts : allPosts);
    }, [isAllPost, userPosts, allPosts]);

    if (error) {
        return <div>{error}</div>;
    }

    function displayDetailsFunc(post) {
        const details = <div className='details'>
            <h2 className='more-details-h2'>Written by: {post.user_id}</h2><br />
            <h3 className='more-details-h3'>title: {post.title}</h3><br />
            <h4>{post.body}</h4><br />
            <button onClick={() => setDisplayDetails(null)}>Close</button>
        </div>
        setDisplayDetails(details);
    }

    return (
        <>
            <div className='control'>
                <button onClick={() => setIsAllPosts((prev) => !prev)}>{isAllPost == 0 ? "All Posts" : "My Posts"}</button>
                <Sort type={"posts"} setIsChange={setIsChange} options={["id", "title"]} userData={displayData} setUserData={setDisplayData} />
                <Search type={"posts"} setIsChange={setIsChange} options={["ID", "Title"]} data={displayData} setData={setDisplayData} />
                <Add type={"posts"} setIsChange={setIsChange} inputs={["title", "body"]} setData={setUserPosts} defaultValue={{ user_id: 'null' }} />
            </div>
            <div className="container">
                <h1>Posts</h1>
                {displayData.length > 0 ? (
                    <div className="posts-list">
                        {displayData.map((post) => (
                            <div
                                key={post.id}
                                className="post-item"
                            >
                                <div className='post-details'>
                                    <p>#{post.id}</p>
                                    <h4>{post.title}</h4>
                                    <button onClick={() => displayDetailsFunc(post)}>More Details</button>
                                    <button onClick={() => navigate(`/users/${currentUser.id}/posts/${post.id}/comments`)}>Comments</button>
                                    <Add type={"comments"} setIsChange={null} inputs={["name", "body"]} setData={setUserPosts} defaultValue={{ post_id: post.id, email: currentUser.email }} name="Add Comment" />
                                </div>
                                <div className='post-actions'>
                                    {post.user_id == currentUser.id && <Update type={"posts"} itemId={post.id} setIsChange={setIsChange} inputs={["title", "body"]} />}
                                    {post.user_id == currentUser.id && <Delete type={"posts"} itemId={post.id} setIsChange={setIsChange} />}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No posts found.</p>
                )}
                {displayDetails != null && displayDetails}
            </div >
            <Outlet />
        </>
    );
}

export default Posts;