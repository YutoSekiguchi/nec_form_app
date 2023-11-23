const FORM_SETTING_API_URL = `${process.env.REACT_APP_API_URL}/form_settings`;

// GET
// 全て取得
export const getFormSettings = async () => {
  const url = `${FORM_SETTING_API_URL}`;
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

// tidで取得
export const getFormSettingByTid = async (tid) => {
  const url = `${FORM_SETTING_API_URL}/tid/${tid}`;

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
export const getFormSettingById = async (id) => {
  const url = `${FORM_SETTING_API_URL}/id/${id}`;

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

// form_idで取得
export const getFormSettingByFormId = async (form_id) => {
  const url = `${FORM_SETTING_API_URL}/form_id/${form_id}`;

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
export const createFormSetting = async (formSetting) => {
  const url = `${FORM_SETTING_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formSetting),
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

// DELETE
// idで削除
export const deleteFormSetting = async (id) => {
  const url = `${FORM_SETTING_API_URL}/id/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response);
      return null;
    }
    return true;
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}
