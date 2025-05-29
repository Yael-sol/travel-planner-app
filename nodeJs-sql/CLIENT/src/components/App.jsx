import { useState, createContext, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import LogIn from './LogIn';
import Register from './Register';
import Home from './Home';
import Posts from './Posts';
import Comments from './Comments';
import Todos from './Todos';
import Info from './Info';
import ErrorPage from './ErrorPage'
import '../style/App.css'

export const CurrentUser = createContext([]);

function App() {
  const initialCurrentUser = useMemo(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [isShowInfo, setIsShowInfo] = useState(0);

  return (
    <>
      <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
        <Navigation currentUser={currentUser} setIsShowInfo={setIsShowInfo} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path='/users/:user_id'>
            <Route path="home" element={<Home />} />
            <Route path="todos" element={<Todos />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/:post_id/comments" element={<Comments />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        {(isShowInfo == 1) && <Info setIsShowInfo={setIsShowInfo} />}
      </CurrentUser.Provider>
    </>
  )
}

export default App