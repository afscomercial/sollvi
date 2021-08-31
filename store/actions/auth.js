import {Auth} from 'aws-amplify';

export const SIGNUP = 'SIGNUP';

export const signup = (email, password) => {
  return async dispatch => {
    const response = await Auth.signUp(email, password);

    console.log(response);
    dispatch({type: SIGNUP});
  };
};
