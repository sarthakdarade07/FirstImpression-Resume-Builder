
export const getValidToken = () => {

  const token = localStorage.getItem("jwtToken") ;
  if (!token) return null;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    return null;
  }
};

export const clearSessionAndRedirect = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  if (!window.location.pathname.includes("/sign-in")) {
    window.location.href = `/?expired=true&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }
};
