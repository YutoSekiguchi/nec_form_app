import { useEffect } from "react";
import { ColorPickerIcon } from "../../icons/color_picker";
import { MaterialSymbolsDeleteOutlineRounded } from "../../icons/delete";
import { EditIcon } from "../../icons/edit";
import "./CardContainer.css";

const CardDetails = ({
  card,
  onEdit,
  onDelete,
  setOpenColorPicker,
  openColorPicker,
  predefinedColors,
  handleColorChange,
}) => {

  const handleClickOutside = (event) => {
    if (!(event.target.id === "predefined-colors" || event.target.className === "color-swatch") && openColorPicker) {
      setOpenColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openColorPicker]);

  if (!card) return <div>カードが選択されていません。</div>;

  return (
    <div className="card-details-content">
      <div className="color-wrapper">
        <div
          className="icon"
          styles={{}}
          onClick={() => setOpenColorPicker((prev) => !prev)}
        >
          <ColorPickerIcon />
        </div>
        {openColorPicker && (
          <div id="color-controls">
            <div id="predefined-colors">
              {predefinedColors.map((color) => (
                <div
                  key={color}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
            {/* <div id="new-color-form">
                    <input 
                      type="color" 
                      value={newColor} 
                      onChange={(e) => setNewColor(e.target.value)} 
                    />
                    <button onClick={addNewColor}>色を追加</button>
                  </div> */}
          </div>
        )}
      </div>
      <button onClick={() => onEdit(card)}>
        <EditIcon />
        編集
      </button>
      <div onClick={() => onDelete(card)} className="delete_icon">
        <MaterialSymbolsDeleteOutlineRounded />
      </div>
    </div>
  );
};

export default CardDetails;
