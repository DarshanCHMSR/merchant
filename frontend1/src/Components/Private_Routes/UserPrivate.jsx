import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Auth_Spinner } from "../Loading/Auth_Spinner";
import axios from "axios";
import { url } from "../backend_link/data";


const UserPrivate = () => {

  const [ok, setOk] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${url}/api/v2/auth/userAuth`,
          {
            headers:{
              Authorization:auth?.token,
          }
          }
        );

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log("Error during auth check");
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet/> : <Auth_Spinner/>;
};

export default UserPrivate;
