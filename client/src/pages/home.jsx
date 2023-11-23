import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { useNavigate } from 'react-router-dom';
import { generateRandomString } from '../modules/generate_radom_string';
import Cookies from 'js-cookie';
import { deleteForm, getForms } from '../services/form';
import { getTeams } from '../services/team';
import { useAtom } from 'jotai';
import { dropDownModeAtom } from '../jotai/info';
import { MaterialSymbolsDeleteOutlineRounded } from '../components/icons/delete';
import CardContainer from '../components/home/post_it/card_container';

function Home() {
  const [forms, setForms] = useState([]);
  const [teams, setTeams] = useState([]);
  const options = ["simple", "detail", "Post-it"];
  const [mode, setMode] = useAtom(dropDownModeAtom);// simple or detail
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const id = generateRandomString();
    const groupNumber = Cookies.get('groupNumber');
    if (groupNumber === undefined || groupNumber == null) {
      alert("ログインしなおしてください");
      navigate("/");
      return;
    }
    navigate(`/new?groupNumber=${groupNumber}&id=${id}`);
  }

  const toggleDropdown = () => setIsOpenDropdown(!isOpenDropdown);

  const changeMode = (option) => {
    setMode(option);
    setIsOpenDropdown(false);
  }

  const confirmDelete = async(e, id) => {
    e.stopPropagation();
    if (window.confirm('本当に削除しますか？')) {
      await deleteForm(id);
      window.location.reload();
    } else {
      return;
    }
  }

  const movePage = (tid, longid) => {
    let teamName = checkTeam(tid);
    if (teamName === undefined || teamName == null) {
      teamName = "0";
    }
    navigate(`/new?groupNumber=${teamName}&id=${longid}`);
  }

  const countExistData = (json) => {
    let count = 0;
    for (const key in json) {
      if (json[key] !== "") {
        count++;
      }
    }
    return count;
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

  // const getTID = async (groupNumber) => {
  //   const res = await getTeams();
  //   for (var i = 0; i < res.length; i++) {
  //     if (res[i].Name === groupNumber) {
  //       return res[i].ID
  //     }
  //   }
  //   return null;
  // }

  const getMyTeamForms = (forms, groupNumber) => {
    const myTeamForms = [];
    for (var i = 0; i < forms.length; i++) {
      if (checkTeam(forms[i].TID) === groupNumber) {
        myTeamForms.push(forms[i]);
      }
    }
    console.log(myTeamForms)
    return myTeamForms;
  }

  useEffect(() => {
    const isLogin = Cookies.get('groupNumber');
    if (isLogin === undefined && isLogin === null) {
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
    scrollToTop();

  }, [navigate])


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズなスクロール動作
    });
  };

  return (
    <div className='home-main'>
      <div className={styles.new_button_container}>
        <div className={styles.fixed}>
          <div className='text-center'>
            <h1 className={styles.title}>グループ{Cookies.get("groupNumber")}の一覧</h1>
          </div>
          <div className={styles.buttons_container}>
            <div className="dropdown">
              <button onClick={toggleDropdown} className="dropdown-button">
                {mode}&nbsp;&nbsp;{isOpenDropdown ? <span className='dark-gray-text'>&#9650;</span> : <span className='dark-gray-text'>&#9660;</span>}
              </button>
              {isOpenDropdown && (
                  <div className="dropdown-content">
                      {options.map((option, index) => (
                          <div key={index} className="dropdown-item" onClick={() => changeMode(option)}>
                              {option}
                          </div>
                      ))}
                  </div>
              )}
            </div>
            <div className={styles.new_button_wrapper}>
              <button type="submit" className={styles.new_button} onClick={handleSubmit}>新規作成+</button>
            </div>
          </div>
        </div>
        <div className={styles.container}>

        {
          mode === "Post-it" && teams?
          <>
            {
              Array.isArray(forms) && 
              <>
                <CardContainer forms={getMyTeamForms(forms, Cookies.get("groupNumber"))} teams={teams} />
              </>
            }
          </>
          :
          <>
          {
            Array.isArray(forms) &&
            <div className={styles.forms_container}>
              {
                forms.map((form, index) => {
                  return (
                    <div key={index}>
                    {checkTeam(form.TID) === Cookies.get('groupNumber') &&
                    <div className={mode === "detail"? styles.form_container: styles.short_form_container} onClick={() => movePage(form.TID, form.LongID)}>
                      <div className={mode === "detail"? styles.form_left: styles.short_form_left}>
                        {/* <div className={styles.form_number}>{index + 1}</div> */}
                        <div className={styles.form_name_wrapper}>
                          <div className={styles.form_name}>仮説: <strong>{form.Hypothesis}</strong></div>
                          {/* <div className={styles.form_name}>グループ: <strong>{form.GroupNumber}</strong></div> */}
                        </div>
                      </div>
                      {mode === "detail" &&
                        <div className={styles.form_description_list}>
                            <div className={isCheckFillData(form).isObservation ? styles.form_description_comp1: styles.form_description}>
                            {
                              isCheckFillData(form).isObservation &&
                              <>
                                {countExistData(form.Observation)}
                              </>
                            }
                              &nbsp;
                              観察
                            </div>
                            <div className={isCheckFillData(form).isObservationResult ? styles.form_description_comp2: styles.form_description}>
                            {
                              isCheckFillData(form).isObservationResult &&
                              <>
                                {countExistData(form.ObservationResult)}
                              </>
                            }
                              &nbsp;
                              観察結果
                            </div>
                            <div className={isCheckFillData(form).isHearing ? styles.form_description_comp3: styles.form_description}>
                            {
                              isCheckFillData(form).isHearing &&
                              <>
                                {countExistData(form.Hearing)}
                              </>
                            }
                              &nbsp;
                              ヒアリング
                            </div>
                            <div className={isCheckFillData(form).isHearingResult ? styles.form_description_comp4: styles.form_description}>
                            {
                              isCheckFillData(form).isHearingResult &&
                              <>
                                {countExistData(form.HearingResult)}
                              </>
                            }
                              &nbsp;
                              ヒアリング結果
                          </div>
                        </div>
                      }
                      <div className={styles.form_right}>
                        <div className={styles.delete_icon} onClick={(e) => confirmDelete(e, form.ID)}>
                          <MaterialSymbolsDeleteOutlineRounded />
                        </div>
                      </div>
                    </div>
                    }
                    </div>
                  )
                })
              }
            </div>
          }
        </>
      }
        </div>
      </div>
    </div>
  );
}

export default Home;