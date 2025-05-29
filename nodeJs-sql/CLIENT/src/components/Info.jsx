import { useContext } from 'react';
import { CurrentUser } from './App';

function Info({ setIsShowInfo }) {
    const { currentUser } = useContext(CurrentUser);

    return (
        <>
            <div className='info'>
                <div className='text'>
                    <h3 className='info-title'>user information</h3><br/>
                    <p>name: {currentUser.name}</p><br/>
                    <p>username: {currentUser.username}</p><br/>
                    <p>email: {currentUser.email}</p><br/>
                    <p>phone: {currentUser.phone}</p><br/>
                    <button onClick={() => setIsShowInfo(0)}>Close</button>
                </div>
            </div>
        </>
    )
}

export default Info;