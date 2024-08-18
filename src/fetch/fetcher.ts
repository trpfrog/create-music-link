import { parseLynkifyResponse, createServerActionsFetcher } from "./utils";
import { extractAllCaptureGroups } from "../utils";

/**
 * Create a function that fetches the Lynkify URL for a given music provider URL.
 * @param nextActionId The `next-action` value to use for fetching the Lynkify URL.
 * @returns  A function that fetches the Lynkify URL for a given music provider URL.
 */
export function createLynkifyUrlFetcher(nextActionId: string) {
  return async (musicProviderUrl: string) => {
    console.log(`Fetching Lynkify URL (next-action: ${nextActionId})`);

    const fetcher = createServerActionsFetcher({
      url: "https://lynkify.in/create-link",
      nextAction: nextActionId,
    });
    const res = await fetcher(musicProviderUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch lynkify url", {
        cause: res,
      });
    }

    // `parseLynkifyResponse` expects the response to be text/x-component
    if (res.headers.get("content-type") !== "text/x-component") {
      throw new Error("Unexpected content type from Lynkify", {
        cause: res,
      });
    }

    try {
      const { songType, songName, songId } = await res
        .text()
        .then(parseLynkifyResponse);
      const url = `https://lynkify.in/${songType}/${songName}/${songId}`;
      return url;
    } catch (e) {
      throw new Error("Failed to parse Lynkify response", {
        cause: e,
      });
    }
  };
}

/**
 * Extract `next-action` candidates from the Lynkify website.
 * For technical reasons, we can't identify the correct `next-action` value for fetching the Lynkify URL.
 * Please try all next-action candidates to find the correct one. :(
 * @returns An array of `next-action` candidates.
 */
export async function fetchAllNextActionIdsInLynkify(): Promise<string[]> {
  // Extract all script paths from the Lynkify website
  const scriptPaths = await fetch("https://lynkify.in/create-link")
    .then((r) => r.text())
    .then((html) =>
      extractAllCaptureGroups(/<script src="(.*?)"/g, html).flat()
    );

  // Fetch all scripts and extract next-action values
  return Promise.all(
    scriptPaths.map(async (src) => {
      // next-action is a SHA-1 hash
      const nextActionIdRegex = /"([a-f0-9]{40})"/g;
      // Fetch the script and extract next-action values
      return fetch(`https://lynkify.in${src}`)
        .then((r) => r.text())
        .then((script) =>
          extractAllCaptureGroups(nextActionIdRegex, script).flat()
        );
    })
  ).then((e) => e.flat());
}
