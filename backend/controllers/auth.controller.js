export const signup = async (req, res, next) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  console.log("Login user");
};

export const logout = async (req, res, next) => {
  console.log("logout user");
};
