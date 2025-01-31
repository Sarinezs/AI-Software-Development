import { useState, useEffect } from 'react'
import LoginPage from './page/LoginPage'


function App() {


	return (
		<>
			{/* <div>
				<h2>React Google Login</h2>
				<br /><br />
				{profile ? (
					<div>
						<img src={profile.imageUrl} alt="user image" />
						<h3>User Logged in</h3>
						<p>Name: {profile.name}</p>
						<p>Email: {profile.email}</p>
						<br /><br />
						<GoogleLogout clientId={clientId} buttonText='Log out' onLogoutSuccess={logOut} />
					</div>

				) : (
					<GoogleLogin
						clientId={clientId}
						buttonText='Login with Google'
						onSuccess={onsuccess}
						onFailure={onfailure}
						cookiePolicy={'single_host_origin'}
						isSignedIn={true}
					/>
				)}
			</div>
			<button onClick={fetchUsers}> click me </button>
			<button onClick={logIn}> login </button> */}

			<LoginPage />
		</>
	)
}

export default App
