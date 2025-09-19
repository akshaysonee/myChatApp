import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen"
			style={{
				backgroundImage: 'url("/your-background-image-path.jpg")', // Replace with your image path
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			{/* Login Card with Glassmorphism */}
			<div className="flex w-full max-w-md p-8 rounded-lg shadow-lg"
				style={{
					background: "rgba(255, 255, 255, 0.2)",
					backdropFilter: "blur(10px)",
					border: "1px solid rgba(255, 255, 255, 0.3)",
				}}
			>
				{/* Logo Section */}
				<div className="flex flex-col items-center justify-center w-full">
					<img
						src="/chatLabel.png" // <-- Add your logo path here
						alt="ChatApp Logo"
						className="w-50 h-30 object-contain mb-4" // Adjusted size
					/>
					<h1 className="text-3xl font-bold text-center text-gray-800">
						Login to <span className="text-blue-500">myChat</span>
					</h1>
				</div>

				{/* Form Section */}
				<div className="w-full mt-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Username */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Username
							</label>
							<input
								type="text"
								placeholder="Enter username"
								className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								type="password"
								placeholder="Enter password"
								className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{/* Signup Link */}
						<div className="text-right">
							<Link to="/signup" className="text-sm text-blue-600 hover:underline">
								Dont have an account?
							</Link>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								disabled={loading}
							>
								{loading ? <span className="loading loading-spinner"></span> : "Login"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
