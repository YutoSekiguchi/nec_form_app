const ALL_VIEW_SETTING_API_URL = `${process.env.REACT_APP_API_URL}/all_view_settings`;

// GET
// 全て取得
export const getAllViewSettings = async () => {
  const url = `${ALL_VIEW_SETTING_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}

// idで取得
export const getAllViewSettingById = async (id) => {
  const url = `${ALL_VIEW_SETTING_API_URL}/id/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}

// long_idで取得
export const getAllViewSettingByLongId = async (long_id) => {
  const url = `${ALL_VIEW_SETTING_API_URL}/long_id/${long_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}

// POST
// 新規作成
export const createAllViewSetting = async (data) => {
  const url = `${ALL_VIEW_SETTING_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}

// DELETE
// idで削除
export const deleteAllViewSetting = async (id) => {
  const url = `${ALL_VIEW_SETTING_API_URL}/id/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}