import React, { useState, useEffect } from 'react';
import styles from '../styles/Form.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '../components/common/dialog';
import Cookies from 'js-cookie';
import { getTeams } from '../services/team';
import { createForm, getFormByLongId } from '../services/form';
import { useSearchParams } from 'react-router-dom';
import { createFormSetting } from '../services/form_setting';

const wsurl = process.env.REACT_APP_WS_URL;

let isSend = false;

function New() {
  // 共同編集フォームの状態
  const [hypoFormData, setHypoFormData] = useState({});
  const [observationFormData, setObservationFormData] = useState({observationTextAreaField1: "", observationTextAreaField2: "", observationTextAreaField3: ""});
  const [observationResultFormData, setObservationResultFormData] = useState({observationResultTextAreaField1: "", observationResultTextAreaField2: "", observationResultTextAreaField3: ""});
  const [askData, setAskData] = useState({askTextAreaField1: "", askTextAreaField2: "", askTextAreaField3: ""});
  const [askResultData, setAskResultData] = useState({askTextResultAreaField1: "", askTextResultAreaField2: "", askTextResultAreaField3: ""});
  const [firstLoad, setFirstLoad] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tid, setTid] = useState(null);
  // const [isSend, setIsSend] = useState(false);
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fid = queryParams.get('id');
  const groupNumber = queryParams.get('groupNumber');


  const navigate = useNavigate();
  
  // WebSocket接続の状態
  const [ws, setWs] = useState(null);

  const getFormData = async (fid) => {
    const res = await getFormByLongId(fid);
    if (res === null || res === undefined) {
      return;
    }
    setHypoFormData({hypoInputField: res.Hypothesis});
    if (res.Observation !== undefined && res.Observation !==  "") {
      setObservationFormData(JSON.parse(res.Observation));
    }
    if (res.ObservationResult !== undefined && res.ObservationResult !== "") {
      setObservationResultFormData(JSON.parse(res.ObservationResult));
    }
    if (res.Hearing !== undefined && res.Hearing !== "") {
      setAskData(JSON.parse(res.Hearing));
    }
    if (res.HearingResult !== undefined && res.HearingResult !== "") {
      setAskResultData(JSON.parse(res.HearingResult));
    }
  }

  useEffect(() => {
    // WebSocket接続
    
    const isLogin = Cookies.get('groupNumber');
    if (isLogin === undefined || isLogin === null) {
      navigate(`/`);
      return;
    }

    const getTID = async () => {
      const res = await getTeams();
      if (res === null) {
        navigate(`/`);
        return;
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i].Name === searchParams.get("groupNumber")) {
          setTid(res[i].ID);
        }
      }
    }

    

    getTID();
    if (fid !== null) {
      getFormData(fid);
    }

    
    const socket = new WebSocket(wsurl);
    socket.onmessage = event => {
      // サーバーからのデータを適切な状態に設定
      const message = JSON.parse(event.data);
      const { id, formId, data } = message;
      // 初期データの処理
      if (firstLoad === false) {
        Object.keys(message.data).forEach(key => {
          if (key === fid && message["data"][key] !== undefined) {
            Object.keys(message["data"][key]).forEach(name => {
              if (name === 'hypoForm') {
                setHypoFormData(message["data"][key][name]);
              } else if (name === 'observationForm') {
                setObservationFormData(message["data"][key][name]);
              } else if (name === 'observationResultForm') {
                setObservationResultFormData(message["data"][key][name]);
              } else if (name === 'ask') {
                setAskData(message["data"][key][name]);
              } else if (name === 'askResult') {
                setAskResultData(message["data"][key][name]);
              }
            });
          }
        });
        setFirstLoad(true);
      } else {
        // 他のクライアントからの更新の処理
        if (id === fid) {
          if (formId === 'send') {
            isSend = data["send"];
          }
          if (!isSend) {
            if (formId === 'hypoForm') {
              setHypoFormData(data);
            } else if (formId === 'observationForm') {
              setObservationFormData(data);
            } else if (formId === 'observationResultForm') {
              setObservationResultFormData(data);
            } else if (formId === 'ask') {
              setAskData(data);
            } else if (formId === "askResult") {
              setAskResultData(data);
            }
          }
        }
      }
    };
    
    setWs(socket);

    // コンポーネントのアンマウント時にWebSocket接続を閉じる
    return () => socket.close();
  }, [firstLoad, fid, navigate, groupNumber, searchParams]);

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth' // スムーズなスクロール動作
  //   });
  // };

  const handleBack = () => {
    navigate(`/home`);
  }

  const handleSubmit = async() => {
    // APIに送るデータの作成
    // 配列は文字列にする
    await ws.send(JSON.stringify({ id: fid, formId: 'send', data: {send: true} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'hypoForm', data: {} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'observationForm', data: {observationTextAreaField1: "", observationTextAreaField2: "", observationTextAreaField3: ""} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'observationResultForm', data: {observationResultTextAreaField1: "", observationResultTextAreaField2: "", observationResultTextAreaField3: ""} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'ask', data: {askTextAreaField1: "", askTextAreaField2: "", askTextAreaField3: ""} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'askResult', data: {askTextResultAreaField1: "", askTextResultAreaField2: "", askTextResultAreaField3: ""} }));
    await ws.send(JSON.stringify({ id: fid, formId: 'send', data: {send: false} }));
    const postFormData = {
      LongID: fid,
      TID: tid,
      Hypothesis: hypoFormData.hypoInputField,
      Observation: JSON.stringify(observationFormData),
      ObservationResult: JSON.stringify(observationResultFormData),
      Hearing: JSON.stringify(askData),
      HearingResult: JSON.stringify(askResultData),
    };

    const postFormSettingData = {
      TID: tid,
      FormID: fid,
      FormGroupingID: 0,
      Color: "#FFFFFF",
      BackgroundColor: "#000000",
      PositionTop: Math.random() * 300,
      PositionLeft: Math.random() * 300,
    }
    
    // フォームデータを送信
    const res = await createForm(postFormData);
    if (res === null) {
      alert("送信に失敗しました");
      return;
    }

    const formSettingRes = await createFormSetting(postFormSettingData);
    if (formSettingRes === null) {
      alert("送信に失敗しました");
      return;
    }
    
    
    setIsDialogOpen(true);

    // scrollToTop();
    
    // navigate(`/new?groupNumber=${searchParams.get("groupNumber")}&id=${generateRandomString()}`);
    window.setTimeout(() => {
      setIsDialogOpen(false);
      navigate(`/home`);
    }, 1500);
  }

  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 仮説フォームデータのハンドラ
  const handleHypoFormDataChange = (event) => {
    const { name, value } = event.target;
    const updatedHypoFormData = { ...hypoFormData, [name]: value };
    setHypoFormData(updatedHypoFormData);
    if (!isComposing) {
      ws.send(JSON.stringify({ id: fid, formId: 'hypoForm', data: updatedHypoFormData }));
    }
  };
  const handleHypoFormDataCompositionEnd = (event) => {
    setIsComposing(false);
    handleHypoFormDataChange(event)
    const { name, value } = event.target;
    const updatedHypoFormData = { ...hypoFormData, [name]: value };
    setHypoFormData(updatedHypoFormData);
    ws.send(JSON.stringify({ id: fid, formId: 'hypoForm', data: updatedHypoFormData }));
  };


  const handleObservationFormDataChange = (event, index) => {
    const { name, value } = event.target;
    const updatedObservationFormData = {...observationFormData, [name]: value};
    setObservationFormData(updatedObservationFormData);
    if(!isComposing) {
      ws.send(JSON.stringify({ id: fid, formId: 'observationForm', data: updatedObservationFormData }));
    }
  };
  const handleObservationFormDataCompositionEnd = (event, index) => {
    setIsComposing(false);
    const { name, value } = event.target;
    const updatedObservationFormData = {...observationFormData, [name]: value};
    setObservationFormData(updatedObservationFormData);
    ws.send(JSON.stringify({ id: fid, formId: 'observationForm', data: updatedObservationFormData }));
  };

  const handleObservationResultFormDataChange = (event, index) => {
    const { name, value } = event.target;
    const updatedObservationResultFormData = {...observationResultFormData, [name]: value};
    setObservationResultFormData(updatedObservationResultFormData);
    if(!isComposing) {
      ws.send(JSON.stringify({ id: fid, formId: 'observationResultForm', data: updatedObservationResultFormData }));
    }
  };
  const handleObservationResultFormDataCompositionEnd = (event, index) => {
    setIsComposing(false);
    const { name, value } = event.target;
    const updatedObservationResultFormData = {...observationResultFormData, [name]: value};
    setObservationResultFormData(updatedObservationResultFormData);
    ws.send(JSON.stringify({ id: fid, formId: 'observationResultForm', data: updatedObservationResultFormData }));
  };

  const handleAskDataChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAskData = {...askData, [name]: value};
    setAskData(updatedAskData);
    if(!isComposing) {
      ws.send(JSON.stringify({ id: fid, formId: 'ask', data: updatedAskData }));
    }
  };
  const handleAskDataCompositionEnd = (event, index) => {
    setIsComposing(false);
    const { name, value } = event.target;
    const updatedAskData = {...askData, [name]: value};
    setAskData(updatedAskData);
    ws.send(JSON.stringify({ id: fid, formId: 'ask', data: updatedAskData }));
  };

  const handleAskResultDataChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAskResultData = {...askResultData, [name]: value};
    setAskResultData(updatedAskResultData);
    if (!isComposing) {
      ws.send(JSON.stringify({ id: fid, formId: 'askResult', data: updatedAskResultData }));
    }
  };
  const handleAskResultDataCompositionEnd = (event, index) => {
    setIsComposing(false);
    const { name, value } = event.target;
    const updatedAskResultData = {...askResultData, [name]: value};
    setAskResultData(updatedAskResultData);
    ws.send(JSON.stringify({ id: fid, formId: 'askResult', data: updatedAskResultData }));
  };


  const addObservationField = () => {
    const name = `observationTextAreaField${Object.keys(observationFormData).length + 1}`;
    setObservationFormData({...observationFormData, [name]: ""}); // 空のフィールドを追加
  };

  const addObservationResultField = () => {
    const name = `observationResultTextAreaField${Object.keys(observationResultFormData).length + 1}`;
    setObservationResultFormData({...observationResultFormData, [name]: ""}); // 空のフィールドを追加
  }

  const addAskField = () => {
    const name = `askTextAreaField${Object.keys(askData).length + 1}`;
    setAskData({...askData, [name]: ""}); // 空のフィールドを追加
  }

  const addAskResultField = () => {
    const name = `askTextResultAreaField${Object.keys(askResultData).length + 1}`;
    setAskResultData({...askResultData, [name]: ""}); // 空のフィールドを追加
  }

  return (
    <div className="App">
      {
        isDialogOpen &&
        <Dialog isOpen={true} onClose={() => {setIsDialogOpen(false)}} text={"フォーム内容を追加しました"} />
      }
      <h1 className="text-center">フォーム</h1>
      <div className={styles.forms}>

        {/* 仮説フォーム */}
        <div className={styles.formWrapper}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>仮説</div>
            <input
              className={styles.inputField}
              name="hypoInputField"
              value={hypoFormData.hypoInputField || ''}
              onCompositionStart={handleCompositionStart}
              onChange={handleHypoFormDataChange}
              onCompositionEnd={handleHypoFormDataCompositionEnd}
              placeholder="仮説を入力してください"
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>観察</div>
            {
              Object.keys(observationFormData).map((key, index) => (
                <textarea
                  key={index}
                  className={styles.textAreaField}
                  name={`${key}`}
                  value={observationFormData[key] || ''}
                  onChange={(event) => handleObservationFormDataChange(event, index)}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={(event) => handleObservationFormDataCompositionEnd(event, index)}
                  placeholder={`観察内容を記入してください`}
                ></textarea>
              ))
            }
            <button onClick={addObservationField}>+</button>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>観察結果</div>
            {
              Object.keys(observationResultFormData).map((key, index) => (
                <textarea
                  key={index}
                  className={styles.textAreaField}
                  name={`${key}`}
                  value={observationResultFormData[key] || ''}
                  onChange={(event) => handleObservationResultFormDataChange(event, index)}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={(event) => handleObservationResultFormDataCompositionEnd(event, index)}
                  placeholder={`観察結果を記入してください`}
                ></textarea>
              ))
            }
            <button onClick={addObservationResultField}>+</button>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>ヒアリング</div>
            {
              Object.keys(askData).map((key, index) => (
                <textarea
                  key={index}
                  className={styles.textAreaField}
                  name={`${key}`}
                  value={askData[key] || ''}
                  onChange={(event) => handleAskDataChange(event, index)}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={(event) => handleAskDataCompositionEnd(event, index)}
                  placeholder={`ヒアリングしたい内容を記入してください`}
                ></textarea>
              ))
            }
            <button onClick={addAskField}>+</button>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>ヒアリング結果</div>
            {
              Object.keys(askResultData).map((key, index) => (
                <textarea
                  key={index}
                  className={styles.textAreaField}
                  name={`${key}`}
                  value={askResultData[key] || ''}
                  onChange={(event) => handleAskResultDataChange(event, index)}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={(event) => handleAskResultDataCompositionEnd(event, index)}
                  placeholder={`ヒアリング結果の内容を記入してください`}
                ></textarea>
              ))
            }
            <button onClick={addAskResultField}>+</button>
          </div>
          <button className={styles.buttonBack} onClick={handleBack}>
            一覧に戻る
          </button>
          <button className={styles.buttonSubmit} onClick={handleSubmit}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

export default New;
