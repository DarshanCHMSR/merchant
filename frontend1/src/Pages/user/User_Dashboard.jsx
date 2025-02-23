import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const User_Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  console.log(user.phone)
  return (
    <>
      
      <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-4">
          {/* Profile Card */}
          <div className="card mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">{user.email}</p>
              <p className="card-text">{user.phone}</p>

              {/* <a href="#" className="btn btn-primary">Edit Profile</a> */}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          {/* Recent Activities */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title">Orders</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <Link to = '/order-tracking'>
                <li className='list-group-item'>
                  Check Your Orders
                </li></Link>

                <Link to = '/dashboard/user/update-profile'>
                <li className='list-group-item mt-2'>
                  Update Profile
                </li>
                </Link>
              </ul>

              
            </div>


          </div>

          {/* Settings */}
      
        </div>
      </div>
    </div>

    </>
  )
}

export default User_Dashboard