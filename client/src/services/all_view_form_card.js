const ALL_VIEW_FORM_CARD_API_URL = `${process.env.REACT_APP_API_URL}/all_view_form_cards`;

// GET
// 全て取得
export const getAllViewFormCards = async () => {
  const url = `${ALL_VIEW_FORM_CARD_API_URL}`;
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
export const getAllViewFormCardById = async (id) => {
  const url = `${ALL_VIEW_FORM_CARD_API_URL}/id/${id}`;

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

// view_long_idで取得
export const getAllViewFormCardByViewLongId = async (view_long_id) => {
  const url = `${ALL_VIEW_FORM_CARD_API_URL}/view_long_id/${view_long_id}`;

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
export const createAllViewFormCard = async (data) => {
  const url = `${ALL_VIEW_FORM_CARD_API_URL}`;
  const body = JSON.stringify(data);
  try {
    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
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

// DELETE
// idで削除
export const deleteAllViewFormCardById = async (id) => {
  const url = `${ALL_VIEW_FORM_CARD_API_URL}/id/${id}`;

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
  } catch (error) {
    console.error("There was an error!", error);
    return null;
  }
}