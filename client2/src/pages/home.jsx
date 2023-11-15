import { useAtom } from 'jotai';
import styles from '../styles/Home.module.css';
import { useNavigate } from 'react-router-dom';
import { groupNumberAtom } from '../jotai/info';
import { generateRandomString } from '../modules/generate_radom_string';

function Home() {

  const [groupNumber, ] = useAtom(groupNumberAtom);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const id = generateRandomString();
    navigate(`/new?groupNumber=${groupNumber}&id=${id}`);
  }

  return (
    <div className='home-main'>
      <div className={styles.new_button_container}>
        <button type="submit" className={styles.new_button} onClick={handleSubmit}>新規作成+</button>
      </div>
    </div>
  );
}

export default Home;