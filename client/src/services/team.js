const TEAM_API_URL = `${process.env.REACT_APP_API_URL}/teams`;

// GET
// 全て取得
export const getTeams = async () => {
  const url = `${TEAM_API_URL}`;
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
export const createTeam = async (team) => {
  const url = `${TEAM_API_URL}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
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