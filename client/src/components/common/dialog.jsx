import React from 'react';
import styles from '../../styles/Dialog.module.css';

function Dialog({ isOpen, onClose, text, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
          {text}
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export default Dialog;