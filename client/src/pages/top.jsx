import React, { useState, useEffect } from 'react';
import styles from '../styles/Top.module.css';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { groupNumberAtom } from '../jotai/info';
import { createTeam, getTeams } from '../services/team';
import getTodayDateString from '../modules/generate_today_date';
import Cookies from 'js-cookie';

function Top() {
  const navigate = useNavigate();
  const [, setGroupNumber] = useAtom(groupNumberAtom);

  const [formData, setFormData] = useState({
    password: '',
    groupNumber: ''
  });
  const [groups, setGroups] = useState(null);

  const handleChange = (e) => {
    console.log(e.target.name);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== getTodayDateString()) {
      alert('パスワードが違います');
      return;
    }

    if (formData.groupNumber === '' || formData.groupNumber === null) {
      alert('グループ番号を入力してください');
      return;
    }

    if (groups !== null) {
      for(var i = 0; i < groups.length; i++) {
        if (groups[i].Name === `${formData.groupNumber}`) {
          setGroupNumber(formData.groupNumber);
          navigate(`/home`);
          Cookies.set('login', "ok", { expires: 7 });
          return;
        }
      }
    }

    const teamData = {
      name: `${formData.groupNumber}`,
    }
    const res = await createTeam(teamData);
    if(res === null) {
      alert("作成に失敗しました")
      return;
    }
    setGroupNumber(formData.groupNumber);
    Cookies.set('login', "ok", { expires: 7 });
    navigate(`/home`);
  };

  useEffect(() => {
    const getAllGroups = async () => {
      const res = await getTeams();
      if (res === null) {
        return;
      }
      setGroups(res);
    }
    getAllGroups();
  }, []);
  

  return (
    <div className='main'>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.formGroup}>
            <label className={styles.label}>パスワード:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="パスワードを入力"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>グループ番号:</label>
            <input 
              type="number" 
              name="groupNumber" 
              value={formData.groupNumber} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="グループ番号を入力"
            />
          </div>
          <div className='w-full text-center'>
            <button type="submit" className={styles.button} onClick={handleSubmit}>ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Top;
