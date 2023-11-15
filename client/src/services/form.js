const FORM_API_URL = `${process.env.REACT_APP_API_URL}/forms`;
const APP_PASS = process.env.REACT_APP_PASS;

// GET
// 全て取得
export const getForms = async () => {
  const url = `${FORM_API_URL}`;
  try {
    const base64Credentials = btoa(APP_PASS);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
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

// longidで取得
export const getForm = async (longid) => {
  const url = `${FORM_API_URL}/longid/${longid}`;
  try {
    const base64Credentials = btoa(APP_PASS);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
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
export const createForm = async (form) => {
  const url = `${FORM_API_URL}`;
  try {
    const base64Credentials = btoa(APP_PASS);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(form),
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