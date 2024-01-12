import { useState, useEffect } from 'react';
import styles from '../styles/All.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import CardContainer from '../components/home/post_it/card_container';
import { getForms } from '../services/form';
import { getTeams } from '../services/team';
import html2canvas from 'html2canvas'
import { createAllViewSetting, getAllViewSettingByLongId } from '../services/all_view_setting';

function AllView() {
  const [forms, setForms] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allViewSetting, setAllViewSetting] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewID = queryParams.get('id');

  const handleMoveHome = () => {
    saveAsImage();
    navigate("/home");
  }

  const saveAsImage = () => {
    html2canvas(document.querySelector('#card-container')).then((canvas) => {
      // トリミングする領域の座標とサイズ
      const x = 0;  // トリミング開始位置のX座標
      const y = 0;  // トリミング開始位置のY座標
      const width = 3000;  // トリミングする幅
      const height = 2000; // トリミングする高さ

      // 新しいCanvasを作成
      const trimmedCanvas = document.createElement('canvas');
      trimmedCanvas.width = width;
      trimmedCanvas.height = height;

      // 新しいCanvasに元のCanvasから必要な部分をコピー
      const ctx = trimmedCanvas.getContext('2d');
      ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

      // 新しいCanvasの内容をDataURLとして取得
      const imageUrl = trimmedCanvas.toDataURL()
      const postData = {
        Image: imageUrl,
        LongID: viewID,
        Title: allViewSetting.Title || "",
      }
      createAllViewSetting(postData);
    })
  }
  
  useEffect(() => {
    const getAllFormsAndTeams = async () => {
      const resOfForms = await getForms();
      const resOfTeams = await getTeams();
      const resOfAllViewSetting = await getAllViewSettingByLongId(viewID);
      setForms(resOfForms || []);
      setTeams(resOfTeams || []);
      setAllViewSetting(resOfAllViewSetting || null);
    }
    getAllFormsAndTeams();
  }, [viewID]);

  return (
    <div className="all-main">
      <div className={styles.back_button} onClick={handleMoveHome}>
        ←戻る
      </div>
      {
        allViewSetting &&
        <div className={styles.title}>
          {allViewSetting.Title
            ? allViewSetting.Title
            : `Untitled${allViewSetting.ID}`
          }
        </div>
      }
      {
        forms.length > 0 &&
        <CardContainer forms={forms} teams={teams} viewID={viewID} />
      }
    </div>
  );
}

export default AllView;