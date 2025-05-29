import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { fetchData } from "./fetchData";
import { useLogOut } from './LogOut';
function Delete({ type, itemId, setIsChange }) {
    const logOut = useLogOut();
    const [process, setProcess] = useState(0);

    async function deleteFunc(e) {
        e.preventDefault();
        try {
            await fetchData({
                type: `${type}/${itemId}`,
                method: "DELETE",
                onSuccess: (result) => {
                    console.log("Delete successful:", result);
                    setIsChange(1);
                },
                onError: (error) => {
                    console.error(`Failed to delete ${type} with ID ${itemId}: ${error}`);
                    alert("Failed to delete the item. Please try again.");
                },
                logOut,
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        setProcess(0);
    }

    return (
        <>
            <button onClick={(e) => deleteFunc(e)} className="action-btn delete-btn">
                <MdDelete style={{ color: 'black', fontSize: '24px' }} />
            </button>
            {process == 1 && <h3>in process...</h3>}
        </>
    )
}

export default Delete;