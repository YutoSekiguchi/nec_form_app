import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import styles from '../styles/Home.module.css';
import { useNavigate } from 'react-router-dom';
import { groupNumberAtom } from '../jotai/info';
import { generateRandomString } from '../modules/generate_radom_string';
import Cookies from 'js-cookie';
import { getForms } from '../services/form';
import Checkmark from '../components/common/checkmark';
import { getTeams } from '../services/team';

function Home() {
  const [groupNumber, ] = useAtom(groupNumberAtom);
  const [forms, setForms] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const id = generateRandomString();
    navigate(`/new?groupNumber=${groupNumber}&id=${id}`);
  }

  const movePage = (tid, longid) => {
    let teamName = checkTeam(tid);
    if (teamName === undefined || teamName == null) {
      teamName = "0";
    }
    navigate(`/new?groupNumber=${teamName}&id=${longid}`);
  }

  const checkExistData = (json) => {
    for (const key in json) {
      if (json[key] !== "") {
        return true;
      }
    }
    return false;
  }


  const isCheckFillData = (data) => {
    let res = {
      isHearing: checkExistData(data.Hearing),
      isHearingResult: checkExistData(data.HearingResult),
      isObservation: checkExistData(data.Observation),
      isObservationResult: checkExistData(data.ObservationResult),
    }
    return res;
  }

  const checkTeam = (id) => {
    for (var i = 0; i < teams.length; i++) {
      if (teams[i]['ID'] === id) {
        return teams[i]['Name'];
      }
    }
  }

  useEffect(() => {
    const isLogin = Cookies.get('login');
    if (isLogin !== "ok") {
      navigate(`/`);
      return;
    }

    const getFormData = async () => {
      const res = await getForms();
      if (res === null) {
        return;
      }
      const formData = [];
      for(var i = 0; i < res.length; i++) {
        const data = {
          ID: res[i]['ID'],
          TID: res[i]['TID'],
          LongID: res[i]['LongID'],
          Hypothesis: res[i]['Hypothesis'],
          Hearing: JSON.parse(res[i]['Hearing']),
          HearingResult: JSON.parse(res[i]['HearingResult']),
          Observation: JSON.parse(res[i]['Observation']),
          ObservationResult: JSON.parse(res[i]['ObservationResult']),
          GroupNumber: res[i]['GroupNumber'],
          CreatedAt: res[i]['CreatedAt'],
          UpdatedAt: res[i]['UpdatedAt'],
        }
        formData.push(data);
      }
      setForms(formData);
    }
    const getTeamData = async () => {
      const res = await getTeams();
      if (res === null) {
        return;
      }
      setTeams(res);
    }
    
    getFormData();
    getTeamData();

  }, [navigate])

  return (
    <div className='home-main'>
      <div className={styles.new_button_container}>
        <div className='text-center'>
          <h1 className={styles.title}>一覧</h1>
        </div>
        <div className={styles.new_button_wrapper}>
          <button type="submit" className={styles.new_button} onClick={handleSubmit}>新規作成+</button>
        </div>
        {
          Array.isArray(forms) &&
          <div className={styles.forms_container}>
            {
              forms.map((form, index) => {
                return (
                  <div className={styles.form_container} key={index} onClick={() => movePage(form.TID, form.LongID)}>
                    <div className={styles.form_left}>
                      <div className={styles.form_number}>{index + 1}</div>
                      <div>
                        <div className={styles.form_name}>仮説: <strong>{form.Hypothesis}</strong></div>
                        {/* <div className={styles.form_name}>グループ: <strong>{form.GroupNumber}</strong></div> */}
                      </div>
                    </div>
                    <div className={styles.form_description_list}>
                        <div className={isCheckFillData(form).isObservation ? styles.form_description_comp1: styles.form_description}>
                        {
                          isCheckFillData(form).isObservation &&
                          <Checkmark />
                        }
                          観察
                        </div>
                        <div className={isCheckFillData(form).isObservationResult ? styles.form_description_comp2: styles.form_description}>
                        {
                          isCheckFillData(form).isObservationResult &&
                          <Checkmark />
                        }
                          観察結果
                        </div>
                        <div className={isCheckFillData(form).isHearing ? styles.form_description_comp3: styles.form_description}>
                        {
                          isCheckFillData(form).isHearing &&
                          <Checkmark />
                        }
                          ヒアリング
                        </div>
                        <div className={isCheckFillData(form).isHearingResult ? styles.form_description_comp4: styles.form_description}>
                        {
                          isCheckFillData(form).isHearingResult &&
                          <Checkmark />
                        }
                          ヒアリング結果
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    </div>
  );
}

export default Home;