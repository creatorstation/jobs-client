export default function LinkedInLogin() {
  const redirectToLinkedIn = () => {
    const clientId = "77bdm9yb1yeig5";
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/videographer`
    );
    const state = Math.random().toString(36).substring(2);
    const scope = "email openid profile ";

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    window.location.href = linkedInAuthUrl;
  };

  return (
    <button
      onClick={redirectToLinkedIn}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
    >
      <img
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475661/linkedin-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span className="pt-0.5">Continue with Linkedin</span>
    </button>
  );
}
