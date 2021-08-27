export interface PasswordCriteriaProps {}

const PasswordCriteria: React.SFC<PasswordCriteriaProps> = (props) => {
  return (
    <ul className="password-criteria">
      <li>Password must contain 8 characters</li>
      <li>Password must contain 1 uppercase and 1 lowercase character</li>
      <li>Password must contain 1 number</li>
      <li>Password must contain 1 special character</li>
      <li>Password must contain 1 special character</li>
    </ul>
  );
};

export default PasswordCriteria;
