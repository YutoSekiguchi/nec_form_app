import React, { useState, useEffect } from "react";
import "./AllTeams.css";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { generateRandomString } from "../../../modules/generate_radom_string";
import { getTeams } from "../../../services/team";
import { createAllViewSetting, deleteAllViewSetting, getAllViewSettings } from "../../../services/all_view_setting";
import { createAllViewFormCard, getAllViewFormCardByViewLongId } from "../../../services/all_view_form_card";

const AllTeamsMain = (props) => {
  const { forms, teams } = props;
  const navigate = useNavigate();
  const [tid, setTid] = useState(0);
  const groupNumber = Cookies.get('groupNumber');
  const [isAdding, setIsAdding] = useState(false);
  const [allViewSettings, setAllViewSettings] = useState([]);
  const [editingViewSetting, setEditingViewSetting] = useState(null);

  const handleOpenViewPage = (longID) => () => {
    navigate(`/all/view?id=${longID}`);
  }

  const getAllFormSettings = async () => {
    const res = await getAllViewSettings();
    if (res === null) {
      setAllViewSettings([]);
      return;
    }
    setAllViewSettings(res);
  }

  useEffect(() => {
    const getTID = async (groupNumber) => {
      const res = await getTeams();
      if (res === null) {
        navigate(`/`);
        return;
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i].Name === groupNumber) {
          setTid(res[i].ID);
          break
        }
      }
    }
    // 1秒まつ
    setTimeout(() => {
      getAllFormSettings();
      getTID(groupNumber);
    }, 500);
  }, [groupNumber])


  const handleCopyView = async (view) => {
    if (isAdding) return;
    setIsAdding(true);
    const newFormID = generateRandomString();
    const originalView = await getAllViewFormCardByViewLongId(view.LongID);
    for (var i = 0; i < originalView.length; i++) {
      delete originalView[i].ID;
      delete originalView[i].CreatedAt;
      delete originalView[i].UpdatedAt;
      originalView[i].ViewLongID = newFormID;
      const resOfFormCard = await createAllViewFormCard(originalView[i]);
      if (resOfFormCard === null) {
        alert("コピーに失敗しました．")
        setIsAdding(false);
        return
      }
    }
    const newView = {
      TID: tid,
      Title: `${view.Title===""? "untitled"+view.ID: view.Title}のコピー`,
      LongID: newFormID,
      Image: view.Image,
    }
    const res = await createAllViewSetting(newView);
    if (res === null) {
      alert("コピーに失敗しました．")
      setIsAdding(false);
      return
    }
    setIsAdding(false);
    getAllFormSettings();
  }


  const handleDeleteView = async (view) => {
    if (window.confirm("本当に削除しますか？") === false) return;
    await deleteAllViewSetting(view.ID);
    alert("削除しました．");
    getAllFormSettings();
  }

  const AddHistory = () => {
    const handleAddIconClick = async() => {
      if (isAdding) return;
      setIsAdding(true);
      const newFormID = generateRandomString();

      const allViewSettingData = {
        TID: tid,
        Title: "",
        LongID: newFormID,
        Image: "",
      }

      const res = await createAllViewSetting(allViewSettingData);
      if (res === null) {
        alert("追加に失敗しました．")
        setIsAdding(false);
        return
      }
      setIsAdding(false);
      navigate(`/all/view?id=${newFormID}`);
    }
    return (
      <div
        className="notelist-main-add-item"
        onClick={handleAddIconClick}
      >
        <div className="notelist-main-add-item-icon" style={{textAlign: "center", borderStyle: "dashed", borderRadius: "0.375rem", borderColor: "rgb(14, 165, 233)", color: "rgb(14, 165, 233)"}}>
          <p>+</p>
        </div>
        <div className="notelist-main-add-item-title">
          追加...
        </div>
      </div>
    );
  };

  const EditTitleInput = (view) => {
    const [newTitle, setNewTitle] = useState(view.Title);
    const handleEditTitle = async (viewData, title) => {
      if (viewData.view.Title === title) return;
      viewData.view.Title = title;
      const res = await createAllViewSetting(viewData.view);
      if (res === null) {
        alert("タイトルの更新に失敗しました");
        return;
      }
      // setNoteList((prevNotes) =>
      //   prevNotes.map((note) =>
      //     note.ID === noteData.ID ? { ...note, Title: title } : note
      //   )
      // );
      await getAllFormSettings();
      setEditingViewSetting(null);
    };

    return (
      <input
        className="view_edit_input text-center"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => handleEditTitle(view, newTitle)}
        autoFocus
      />
    );
  };


  return (
    <div>
      <div className="all_teams_main">
        <AddHistory />
        {allViewSettings && allViewSettings.sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)).map((view, j) => (
          <div key={j} className="card">
            {
              view.Image === ""?
              <div className="no_image" onClick={handleOpenViewPage(view.LongID)}></div>
            :
              <div className="card_image" onClick={handleOpenViewPage(view.LongID)}>
                <img src={view.Image} alt="" />
              </div>
            }
            <div className="card_detail">
              <div className="card_title truncate">
                {editingViewSetting?.id === view.ID ? (
                  <EditTitleInput view={view} />
                ) : (
                  <span
                    onClick={() =>
                      setEditingViewSetting({ id: view.ID, title: view.Title })
                    }
                  >
                    {view.Title || `untitled${view.ID}`}
                  </span>
                )}
              </div>
              <div className="flex">
                <div className="card_copy_text" onClick={() => handleCopyView(view)}>
                  コピー
                </div>
                <div className="card_delete_text" onClick={() => handleDeleteView(view)}>
                  削除
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllTeamsMain;