import React, { useState, useEffect, useRef } from "react";
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
import {
  createFormSetting,
  getFormSettingByFormId,
  getFormSettingByTid,
} from "../../../services/form_setting";
import Cookies from "js-cookie";
import { getTeams } from "../../../services/team";
import {
  createAllViewFormCard,
  getAllViewFormCardByViewLongIdAndFormId,
  getAllViewFormCards,
} from "../../../services/all_view_form_card";

const wsurl = process.env.REACT_APP_WS_VIEW_URL;

const CardContainer = (props) => {
  const { forms, teams, viewID } = props;
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState([]);
  const [scale, setScale] = useAtom(scaleAtom);
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
    "#f4511e", // ディープオレンジ
  ]);
  const [formSettingData, setFormSettingData] = useState([]);
  const [tid, setTid] = useState(null);
  const [isOpenCardList, setIsOpenCardList] = useState(true);
  const [teamNameToIdData, setTeamNameToIdData] = useState({}); // teamsのNameが同じもののIDをまとめたjsonの作成, KeyはName, ValueはIDのリスト
  const [displayedTeam, setDisplayedTeam] = useState("All"); // チーム名を表示するかどうか
  const allTeams = ["1", "2", "3", "4"];

  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  const getTID = async (groupNumber) => {
    const res = await getTeams();
    if (res === null) {
      navigate(`/`);
      return;
    }
    for (var i = 0; i < res.length; i++) {
      if (res[i].Name === groupNumber) {
        setTid(res[i].ID);
        break;
      }
    }
  };

  const getFormSettings = async (tid) => {
    if (viewID !== undefined) return;
    const formSetting = await getFormSettingByTid(tid);
    if (formSetting === null) {
      setFormSettingData([]);
      return;
    }
    setFormSettingData(formSetting);
  };

  const getAllViewCards = async () => {
    if (viewID === undefined) return;
    const allViewFormCards = await getAllViewFormCards();
    if (allViewFormCards === null) {
      setFormSettingData([]);
      return;
    }
    setFormSettingData(allViewFormCards);
  };

  useEffect(() => {
    const groupNumber = Cookies.get("groupNumber");
    getTID(groupNumber);
  }, []);

  useEffect(() => {
    if (cursorMode === "move") {
      setSelectedCardId(null);
      setSelectedCard(null);
    }
  }, [cursorMode]);

  useEffect(() => {
    const getCardData = async () => {
      if (viewID !== undefined) {
        await getAllViewCards();
      } else {
        if (tid !== null) {
          await getFormSettings(tid);
        }
      }
    };

    getCardData();
  }, [tid]);

  useEffect(() => {
    if (viewID === undefined) return;
    // WebSocket接続の初期化
    const newSocket = new WebSocket(wsurl);
    newSocket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (data.viewID === viewID) {
                  getAllViewCards();
                }
            } catch (error) {
                console.error('JSON解析エラー:', error);
            }
        };
        reader.readAsText(event.data);
    } else {
        try {
            const data = JSON.parse(event.data);
            if (data.viewID === viewID) {
              getAllViewCards();
            }
        } catch (error) {
            console.error('JSON解析エラー:', error);
        }
    }
    };
    setSocket(newSocket);

    return () => newSocket.close(); // コンポーネントのアンマウント時に接続を閉じる
}, []);

useEffect(() => {
  if (socket && viewID !== undefined) {
      console.log("open socket")
      socket.onopen = () => {
          socket.send(JSON.stringify({ type: 'join', viewID }));
      };
  }
}, [socket, viewID]);



  useEffect(() => {
    if (formSettingData.length === 0) {
      return;
    }
    if (viewID === undefined) {
      const positionedForms = forms.map((form) => ({
        ...form,
        position: {
          left:
            getFormSettingDataByLongID(form.LongID)?.PositionLeft ||
            Math.random() * (window.innerWidth - 100),
          top:
            getFormSettingDataByLongID(form.LongID)?.PositionTop ||
            Math.random() * (window.innerHeight - 100),
        },
        color:
          getFormSettingDataByLongID(form.LongID)?.BackgroundColor || "#000000",
      }));
      setFormData(positionedForms);
    } else {
      // if (formData.length !== 0) {
      //   return;
      // }
      const positionedForms = forms.map((form) => ({
        ...form,
        position: {
          left:
            getAllViewCardByViewLongIdAndFormId(viewID, form.LongID)
              ?.PositionLeft || Math.random() * (window.innerWidth - 100),
          top:
            getAllViewCardByViewLongIdAndFormId(viewID, form.LongID)
              ?.PositionTop || Math.random() * (window.innerHeight - 100),
        },
        color:
          getAllViewCardByViewLongIdAndFormId(viewID, form.LongID)
            ?.BackgroundColor || "#000000",
      }));
      setFormData(positionedForms);
    }
  }, [formSettingData]);

  useEffect(() => {
    if (!teams) return;
    const teamNameToId = {};
    for (var i = 0; i < teams.length; i++) {
      if (teamNameToId[teams[i]["Name"]] === undefined) {
        teamNameToId[teams[i]["Name"]] = [];
      }
      teamNameToId[teams[i]["Name"]].push(teams[i]["ID"]);
    }
    setTeamNameToIdData(teamNameToId);
  }, [teams]);

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
  };

  const handleDragStart = (e, card) => {
    if (cursorMode === "select") {
      setCursorMode("move");
    }
    const cardRect = e.target.getBoundingClientRect();
    const offsetX = (e.clientX - cardRect.left) / scale;
    const offsetY = (e.clientY - cardRect.top) / scale;
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ offsetX, offsetY, id: card.ID, LongID: card.LongID })
    );
  };

  const handleDrop = async (e) => {
    if (cursorMode === "select") {
      setCursorMode("move");
    }
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const cardContainerRect = e.currentTarget.getBoundingClientRect();
    const top =
      (e.pageY - window.scrollY - cardContainerRect.top) / scale - data.offsetY;
    const left =
      (e.pageX - window.scrollX - cardContainerRect.left) / scale -
      data.offsetX;
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
    if (viewID === undefined) {
      const formSetting = await getFormSettingByFormId(data.LongID);
      if (formSetting === null || formSetting === undefined) {
        const postFormSettingData = {
          TID: tid,
          FormID: data.LongID,
          FormGroupingID: 0,
          Color: "#ffffff",
          BackgroundColor: "#000000",
          PositionTop: top,
          PositionLeft: left,
        };
        await createFormSetting(postFormSettingData);
        return;
      }
      formSetting.PositionTop = top;
      formSetting.PositionLeft = left;
      await createFormSetting(formSetting);
    } else {
      const formSetting = await getAllViewFormCardByViewLongIdAndFormId(
        viewID,
        data.LongID
      );
      if (formSetting === null || formSetting === undefined) {
        const postFormSettingData = {
          TID: tid,
          FormID: data.LongID,
          ViewLongID: viewID,
          FormGroupingID: 0,
          Color: "#ffffff",
          BackgroundColor: "#000000",
          PositionTop: top,
          PositionLeft: left,
        };
        await createAllViewFormCard(postFormSettingData);
        getAllViewCards();
        if (socket && formData.length !== 0 && formSettingData.length !== 0) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ 
              type: 'update', 
              viewID, 
              formData: "", // 更新されたformData
              formSettingData: ""// 更新されたformSettingData
            }));
          }
        }
        return;
      }
      formSetting.PositionTop = top;
      formSetting.PositionLeft = left;
      await createAllViewFormCard(formSetting);
      getAllViewCards();
      if (socket && formData.length !== 0 && formSettingData.length !== 0) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ 
            type: 'update', 
            viewID, 
            formData: "", // 更新されたformData
            formSettingData: "" // 更新されたformSettingData
          }));
        }
      }
    }
  };


  // useEffect(() => {
  //   if (socket && formData.length !== 0 && formSettingData.length !== 0) {
  //     if (socket.readyState === WebSocket.OPEN) {
  //       socket.send(JSON.stringify({ 
  //         type: 'update', 
  //         viewID, 
  //         formData: formData, // 更新されたformData
  //         formSettingData: formSettingData // 更新されたformSettingData
  //       }));
  //     }
  //   }
  // }, [formData]);

  // 選択されたカードの色を更新する関数
  const handleColorChange = async (color) => {
    if (selectedCardId !== null) {
      setFormData((prevFormData) =>
        prevFormData.map((form) =>
          form.ID === selectedCardId ? { ...form, color: color } : form
        )
      );
      if (viewID === undefined) {
        const formSetting = await getFormSettingByFormId(selectedCard.LongID);
        if (formSetting === null || formSetting === undefined) {
          const postFormSettingData = {
            TID: tid,
            FormID: selectedCard.LongID,
            FormGroupingID: 0,
            Color: "#ffffff",
            BackgroundColor: color,
            PositionTop: Math.random() * 300,
            PositionLeft: Math.random() * 300,
          };
          await createFormSetting(postFormSettingData);
          return;
        }
        formSetting.BackgroundColor = color;
        await createFormSetting(formSetting);
      } else {
        const formSetting = await getAllViewFormCardByViewLongIdAndFormId(
          viewID,
          selectedCard.LongID
        );
        if (formSetting === null || formSetting === undefined) {
          const postFormSettingData = {
            TID: tid,
            FormID: selectedCard.LongID,
            ViewLongID: viewID,
            FormGroupingID: 0,
            Color: "#ffffff",
            BackgroundColor: color,
            PositionTop: Math.random() * 300,
            PositionLeft: Math.random() * 300,
          };
          await createAllViewFormCard(postFormSettingData);
          if (socket && formData.length !== 0 && formSettingData.length !== 0) {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ 
                type: 'update', 
                viewID, 
                formData: "", // 更新されたformData
                formSettingData: "" // 更新されたformSettingData
              }));
            }
          }
          return;
        }
        formSetting.BackgroundColor = color;
        await createAllViewFormCard(formSetting);
        if (socket && formData.length !== 0 && formSettingData.length !== 0) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ 
              type: 'update', 
              viewID, 
              formData: "", // 更新されたformData
              formSettingData: "" // 更新されたformSettingData
            }));
          }
        }
      }
      setCursorMode("move");
    }
  };

  const handleClickCard = (item, e) => {
    if (cursorMode === "move") {
      setCursorMode("select");
    }
    setSelectedCard(item);
    setSelectedCardId(item.ID);
    const cardRect = e.target.getBoundingClientRect();
    setDetailsPosition({
      left: cardRect.left + window.scrollX,
      top: cardRect.top + window.scrollY - 70,
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

  const getAllViewCardByViewLongIdAndFormId = (viewLongID, formLongID) => {
    for (var i = 0; i < formSettingData.length; i++) {
      if (
        formSettingData[i]["FormID"] === formLongID &&
        formSettingData[i]["ViewLongID"] === viewLongID
      ) {
        return formSettingData[i];
      }
    }
    return null;
  };

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
        {viewID === undefined ? (
          <>
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
          </>
        ) : (
          <>
            {formSettingData && formData
              .filter((item) =>
                formSettingData.some(
                  (setting) =>
                    setting.FormID === item.LongID &&
                    setting.ViewLongID === viewID
                )
              )
              .map((item, index) => (
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
          </>
        )}
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
      {viewID !== undefined && (
        <div className="cardlist-container">
          {isOpenCardList ? (
            <>
              <div className="cardlist-dialog">
                <div
                  className="cardlist-container-close-button"
                  onClick={() => {
                    setIsOpenCardList(false);
                  }}
                >
                  閉じる
                </div>
                <div className="cardlist-container-teams">
                  <div
                    className={`cardlist-container-team ${
                      displayedTeam === "All" && "red-bold-text"
                    }`}
                    onClick={() => {
                      setDisplayedTeam("All");
                    }}
                  >
                    All
                  </div>
                  {allTeams.map((team, index) => (
                    <div
                      className={`cardlist-container-team ${
                        displayedTeam === team && "red-bold-text"
                      }`}
                      key={index}
                      onClick={() => {
                        setDisplayedTeam(team);
                      }}
                    >
                      {team}
                    </div>
                  ))}
                </div>
              </div>
              <div className="cardlist">
                {displayedTeam === "All" ? (
                  <>
                    {formData
                      .filter(
                        (item) =>
                          !formSettingData.some(
                            (setting) =>
                              setting.FormID === item.LongID &&
                              setting.ViewLongID === viewID
                          )
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`cardlist-container-card ${
                            item.ID === selectedCardId ? "selected" : ""
                          } ${cursorMode === "move" ? "move" : "select"}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={(e) => handleClickCard(item, e)}
                          style={{
                            backgroundColor: `${item.color}AA`,
                          }}
                        >
                          {item.Hypothesis}
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    {formData
                      .filter(
                        (item) =>
                          !formSettingData.some(
                            (setting) =>
                              setting.FormID === item.LongID &&
                              setting.ViewLongID === viewID
                          ) &&
                          teamNameToIdData[displayedTeam]?.includes(item.TID)
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`cardlist-container-card ${
                            item.ID === selectedCardId ? "selected" : ""
                          } ${cursorMode === "move" ? "move" : "select"}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={(e) => handleClickCard(item, e)}
                          style={{
                            backgroundColor: `${item.color}AA`,
                          }}
                        >
                          {item.Hypothesis}
                        </div>
                      ))}
                  </>
                )}
              </div>
            </>
          ) : (
            <div
              className="cardlist-container-close-button"
              onClick={() => {
                setIsOpenCardList(true);
              }}
            >
              一覧を開く
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardContainer;
