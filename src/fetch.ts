export async function fetchLynkifyUrl(musicProviderUrl: string) {
  const url = new URL("https://lynkify.in/create");
  url.searchParams.append("url", musicProviderUrl);
  const res = await fetch(url);
  if (res.ok) {
    return res.url;
  } else {
    throw new Error("Failed to fetch lynkify url");
  }
}
