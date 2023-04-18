import React, { useEffect } from 'react';
import "./App.css";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { auth } from './Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import { BrowserRouter as Router,Routes,Route,} from "react-router-dom";
import ProfileScreen from './screens/ProfileScreen';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((userAuth)=>{
      if(userAuth){
        //Logged In:
        dispatch(
          login({
          uid:userAuth.uid,
          email:userAuth.email,
        })
        );
      }
      else{
        //Logged Out:
        dispatch(logout());
      }
    });
    return unsubscribe;
  },[dispatch])
  return (
    <div className="app">
      <Router>
        
      {!user ? (<LoginScreen/> ):(
        <Routes>
          <Route
            exact path="/"
            element={
              <React.Fragment>
                {/* Home */}
               <HomeScreen/>
              </React.Fragment>
            }
          />
          <Route
          exact path="/profile"
          element={
            <React.Fragment>
              {/* Home */}
             <ProfileScreen></ProfileScreen>
            </React.Fragment>
          }
        />
        </Routes>
      )}
      </Router>
      
    </div>
  );
}

export default App;
