const Regex = {
  EMAIL:
    /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){1,}@([\w\-]+)((\.[a-zA-Z0-9_-]{2,})+)$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#&%$*])[A-Za-z\d!@#&%$*]{8,}$/,
};

export default Regex;
