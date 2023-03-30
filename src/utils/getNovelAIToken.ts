export default async function getNovelAIToken(): Promise<string> {
  const login_key = process.env.NOVELAI_LOGIN_KEY!;

  try {
    const response = await fetch("https://api.novelai.net/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        key: login_key,
      }),
    });

    const res = await response.json();
    
    return res.accessToken as string;
  } catch (error) {
    console.error(error);
    return '';
  }
}
