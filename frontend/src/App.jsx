import { useEffect, useState } from 'react';
import Routers from '../src/components/Routers';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
const CLIENT_ID = 'Ov23liTb7awx08y8CjLq';

function App() {
  const [reRender, setReRender] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    if (codeParam && localStorage.getItem('user') === null) {
      const getAccessToken = async () => {
        const response = await axiosInstance.get(
          `/getAccessToken?code=${codeParam}`,
        );
        const data = response.data;
        if (data) {
          localStorage.setItem('user', data);
        }
        setReRender(!reRender);
      };
      getAccessToken();
    }
  }, [reRender]);
  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist`,
    );
  };

  return (
    <>
      <Routers login={loginWithGithub} />
    </>
  );
}

export default App;
