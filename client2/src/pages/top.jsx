import React, { useState } from 'react';
import styles from '../styles/Top.module.css';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { groupNumberAtom, passwordAtom } from '../jotai/info';

function Top() {
  const navigate = useNavigate();
  const [, setPassword] = useAtom(passwordAtom);
  const [, setGroupNumber] = useAtom(groupNumberAtom);
  

  const [formData, setFormData] = useState({
    password: '',
    groupNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ログイン処理

    setPassword(formData.password);
    setGroupNumber(formData.groupNumber);

    navigate(`/home`);
  };

  return (
    <div className='main'>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          {/* <div className={styles.formGroup}>
            <label className={styles.label}>ユーザ名:</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="例: Yamada Taro"
            />
          </div> */}

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
            <button type="submit" className={styles.button}>ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Top;
