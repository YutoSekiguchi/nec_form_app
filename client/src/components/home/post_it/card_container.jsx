import React, { useState, useEffect } from "react";
import "./CardContainer.css";
import { ZoomInIcon } from "../../icons/zoomin";
import { ZoomOutIcon } from "../../icons/zoomout";
import { PointerIcon } from "../../icons/pointer";
import { MoveIcon } from "../../icons/move";
import CardDetails from "./card_details";
import { useNavigate } from "react-router-dom";
import { deleteForm } from "../../../services/form";
import { useAtom } from "jotai";
import { scaleAtom } from "../../../jotai/info";
import { createFormSetting, getFormSettingByFormId, getFormSettingByTid } from "../../../services/form_setting";
import Cookies from 'js-cookie';
import { getTeams } from "../../../services/team";

const CardContainer = (props) => {
  const { forms, teams } = props;
  // const [newColor, setNewColor] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState([]);
  const [scale, setScale] = useAtom(scaleAtom);
  // const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedCardId, setSelectedCardId] = useState(null); // 選択されているカードのID
  const [openColorPicker, setOpenColorPicker] = useState(false); // カラーピッカーの表示・非表示
  const [cursorMode, setCursorMode] = useState("move"); // カーソルのモード
  const [detailsPosition, setDetailsPosition] = useState({ left: 0, top: 0 });
  const [predefinedColors, setPredefinedColors] = useState([
    "#e53935", // 赤
    "#d81b60", // ピンク
    "#8e24aa", // 紫
    "#5e35b1", // 濃紫
    "#3949ab", // インディゴ
    "#1e88e5", // 青
    "#039be5", // 明るい青
    "#00acc1", // シアン
    "#00897b", // ティール
    "#43a047", // 緑
    "#7cb342", // ライトグリーン
    "#c0ca33", // ライム
    "#fdd835", // 黄色
    "#ffb300", // アンバー
    "#fb8c00", // オレンジ
    "#f4511e"  // ディープオレンジ
  ]);
  const [formSettingData, setFormSettingData] = useState([]);
  const [tid, setTid] = useState(null);

  const navigate = useNavigate();

  const getTID = async (groupNumber) => {
    const res = await getTeams();
    if (res === null) {
      navigate(`/`);
      return;
    }
    for (var i = 0; i < res.length; i++) {
      if (res[i].Name === groupNumber) {
        setTid(res[i].ID);
      }
    }
  }

  const getFormSettings = async (tid) => {
    const formSetting = await getFormSettingByTid(tid);
    if(formSetting === null) {
      setFormSettingData([]);
      return;
    }
    setFormSettingData(formSetting);
  }

  useEffect(() => {
    const groupNumber = Cookies.get('groupNumber');
    getTID(groupNumber);
  }, []);

  useEffect(() => {
    if (cursorMode === "move") {
      setSelectedCardId(null);
      setSelectedCard(null);
    }
  }, [cursorMode]);

  useEffect(() => {
    if (tid !== null) {
      getFormSettings(tid);
    }
  }, [tid])

  useEffect(() => {
    if (formSettingData.length === 0) {
      return;
    }

    const positionedForms = forms.map((form) => ({
      ...form,
      position: {
        left: getFormSettingDataByLongID(form.LongID)?.PositionLeft || Math.random() * (window.innerWidth - 100),
        top: getFormSettingDataByLongID(form.LongID)?.PositionTop || Math.random() * (window.innerHeight - 100),
      },
      color: getFormSettingDataByLongID(form.LongID)?.BackgroundColor || "#000000",
    }));
    setFormData(positionedForms);
  }, [formSettingData]);

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
    // setScale(Math.max(1, scale - 0.1));
  };

  // const addNewColor = () => {
  //   if (newColor && !predefinedColors.includes(newColor)) {
  //     setPredefinedColors([...predefinedColors, newColor]);
  //   }
  // };

  const handleDragStart = (e, card) => {
    if (cursorMode === "select") {
      return;
    }
    const cardRect = e.target.getBoundingClientRect();
    const offsetX = (e.clientX - cardRect.left) / scale;
    const offsetY = (e.clientY - cardRect.top) / scale;
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ offsetX, offsetY, id: card.ID, LongID: card.LongID })
    );
  };

  const handleDrop = async(e) => {
    if (cursorMode === "select") {
      return;
    }
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const cardContainerRect = e.currentTarget.getBoundingClientRect();
    const top = (e.pageY - window.scrollY - cardContainerRect.top) / scale - data.offsetY;
    const left = (e.pageX - window.scrollX - cardContainerRect.left) / scale - data.offsetX
    setFormData((prevFormData) =>
      prevFormData.map((form) =>
        form.ID === data.id
          ? {
              ...form,
              position: {
                left: left,
                top: top,
              },
            }
          : form
      )
    );
    const formSetting = await getFormSettingByFormId(data.LongID)
    if (formSetting === null || formSetting === undefined) {
      const postFormSettingData = {
        TID: tid,
        FormID: data.LongID,
        FormGroupingID: 0,
        Color: "#ffffff",
        BackgroundColor: "#000000",
        PositionTop: top,
        PositionLeft: left,
      }
      await createFormSetting(postFormSettingData);
      return
    }
    formSetting.PositionTop = top;
    formSetting.PositionLeft = left;
    await createFormSetting(formSetting);
  };

  // 選択されたカードの色を更新する関数
  const handleColorChange = async(color) => {
    if (selectedCardId !== null) {
      setFormData((prevFormData) =>
        prevFormData.map((form) =>
          form.ID === selectedCardId ? { ...form, color: color } : form
        )
      );
      const formSetting = await getFormSettingByFormId(selectedCard.LongID)
      if (formSetting === null || formSetting === undefined) {
        const postFormSettingData = {
          TID: tid,
          FormID: selectedCard.LongID,
          FormGroupingID: 0,
          Color: "#ffffff",
          BackgroundColor: color,
          PositionTop: Math.random() * 300,
          PositionLeft: Math.random() * 300,
        }
        await createFormSetting(postFormSettingData);
        return;
      }
      formSetting.BackgroundColor = color;
      await createFormSetting(formSetting);
    }
  };

  const handleClickCard = (item, e) => {
    if (cursorMode === "move") {
      return;
    }
    setSelectedCard(item);
    setSelectedCardId(item.ID);
    const cardRect = e.target.getBoundingClientRect();
    setDetailsPosition({
      left: cardRect.left + window.scrollX,
      top: cardRect.top + window.scrollY-70,
    });
  };

  const handleClickPointerIcon = () => {
    setCursorMode("select");
  };

  const handleClickMoveIcon = () => {
    setCursorMode("move");
  };

  const checkTeam = (id) => {
    for (var i = 0; i < teams.length; i++) {
      if (teams[i]["ID"] === id) {
        return teams[i]["Name"];
      }
    }
  };

  const handleEditCard = (card) => {
    let teamName = checkTeam(card.ID);
    if (teamName === undefined || teamName == null) {
      teamName = "0";
    }
    navigate(`/new?groupNumber=${teamName}&id=${card.LongID}`);
  };

  const handleDeleteCard = async (card) => {
    if (window.confirm("本当に削除しますか？")) {
      await deleteForm(card.ID);
      window.location.reload();
    } else {
      return;
    }
  };

  // formSettingDataの中からLongIDを指定して、そのデータを取得する
  const getFormSettingDataByLongID = (longID) => {
    for (var i = 0; i < formSettingData.length; i++) {
      if (formSettingData[i]["FormID"] === longID) {
        return formSettingData[i];
      }
    }
    return null;
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const cardDetails = document.getElementById('card-details');

  //     if (!cardDetails || !cardDetails.contains(event.target)) {
  //       setSelectedCard(null);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div>
      <div
        id="card-container"
        style={{
          transform: `scale(${scale})`,
          color: "white",
          transformOrigin: "top left",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {formData.map((item, index) => (
          <div
            key={index}
            className={`draggable-card ${
              item.ID === selectedCardId ? "selected" : ""
            } ${cursorMode === "move" ? "move" : "select"}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={(e) => handleClickCard(item, e)}
            style={{
              backgroundColor: `${item.color}AA`,
              left: `${item.position.left}px`,
              top: `${item.position.top}px`,
            }}
          >
            {item.Hypothesis}
          </div>
        ))}
      </div>
      {selectedCardId && selectedCardId !== null && (
        <div
          className="card-details"
          style={{
            left: `${detailsPosition.left}px`,
            top: `${detailsPosition.top}px`,
            position: "absolute",
          }}
        >
          <CardDetails
            card={selectedCard}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            setOpenColorPicker={setOpenColorPicker}
            openColorPicker={openColorPicker}
            predefinedColors={predefinedColors}
            handleColorChange={handleColorChange}
          />
        </div>
      )}
      <div id="controller-wrapper">
        <div
          className={`icon ${cursorMode === "select" && "selected-icon"}`}
          onClick={handleClickPointerIcon}
        >
          <PointerIcon />
        </div>
        <div
          className={`icon ${cursorMode === "move" && "selected-icon"}`}
          onClick={handleClickMoveIcon}
        >
          <MoveIcon />
        </div>
        <div id="zoom-controls">
          <div onClick={zoomIn} className="icon">
            <ZoomInIcon />
          </div>
          <div onClick={zoomOut} className="icon">
            <ZoomOutIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
