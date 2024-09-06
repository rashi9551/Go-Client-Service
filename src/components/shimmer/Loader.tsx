import { Player } from '@lottiefiles/react-lottie-player';
import './Loader.scss'

const Loader = () => {
  return (
      <Player
        autoplay
        loop
        src="https://lottie.host/93eec4a5-c104-4a36-ab77-111184367fb5/3mDcjHdLMi.json"
        style={{ height: '80%', width: '80%',background:"transparent" }}
      />
  );
};

export default Loader;
