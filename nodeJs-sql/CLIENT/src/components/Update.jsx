import React from "react";
import { useState } from "react";
import { fetchData } from "./fetchData";
import { FaEdit } from "react-icons/fa"
import { useLogOut } from './LogOut';

function Update({ type, itemId, setIsChange, inputs }) {
    const logOut = useLogOut();
    const [screen, setScreen] = useState(0);
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    async function updateFunc(e) {
        e.preventDefault();
        e.target.reset();
        setScreen(0);
        try {
            await fetchData({
                type: `${type}/${itemId}`,
                method: "PUT",
                body: formData,
                onSuccess: (result) => {
                    console.log("Update successful:", result);
                    setIsChange(1);
                },
                onError: (error) => {
                    console.log("Update was unsuccessful:", error);
                },
                logOut,
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    function handleCancel(e) {
        e.target.reset();
        setScreen(0);
    }

    return (
        <>
            {screen == 0 &&
                <button onClick={(e) => setScreen(1)} className="action-btn edit-btn">
                    <FaEdit style={{ color: 'black', fontSize: '20px' }} />
                </button>}
            {screen == 1 && <div>
                <form onSubmit={updateFunc}>
                    {inputs.map((input, index) => (
                        <div key={index}>
                            <input
                                name={input}
                                placeholder={`Enter ${input}`}
                                value={formData[input] || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                    <button type="submit" value={"OK"}>OK</button>
                    <button onClick={handleCancel} value={"cancel"}>cancel</button>
                </form>
            </div>}
        </>
    )
}

export default Update;