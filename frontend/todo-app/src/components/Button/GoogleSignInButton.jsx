import googleImg from "../../assets/images/google-icon.svg"; // Import axios for making requests

const GoogleSignInButton = () => {
  // Use navigate hook for navigation

  const googleLogin = async (e) => {
    e.preventDefault();

    // Redirect to Google for authentication
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(`${baseUrl}/auth/google`, "_self");
  };

  return (
    <button
      onClick={googleLogin}
      className="btn-google w-full flex items-center justify-center mt-2 p-2 border rounded"
    >
      <img src={googleImg} alt="Google Logo" className="w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
