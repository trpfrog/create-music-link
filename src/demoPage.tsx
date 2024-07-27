import { Hono } from "hono"
import { css, Style } from "hono/css"
import { jsxRenderer } from "hono/jsx-renderer"
import { html } from "hono/html"

export const app = new Hono()
  .get(jsxRenderer(({ children }) => {
    const wrapper = css`
      font-family: sans-serif;
      height: 95vh;
      display: grid;
      place-items: center;
      padding: 10px;
    `
    const card = css`
      padding: 10px;
      margin: 1rem;
      border-radius: 15px;
      background: #ff5f6d;
      width: 100%;
      max-width: 500px;
      color: white;
    `

    return (
      <html>
        <head>
          <title>Tweet #nowplaying</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Style/>
        </head>
        <body>
          <div class={wrapper}>
            <div class={card}>
              {children}
            </div>
          </div>
        </body>
      </html>
    )
  }))
  .get("/", (c) => {
    const h1 = css`
      font-weight: bold;
      font-size: 1.5em;
      margin: 0 auto;
      border-radius: 5px;
      padding: 3px 10px;
      background: #00000020;
      color: white;
      text-align: center;
    `
    const wrapper = css`
      margin: 2rem 0;
      display: grid;
      place-items: center;
    `
    const label = css`
      font-size: 0.7em;
    `
    const textBox = css`
      padding: 5px;
      border-radius: 5px;
      border: none;
    `
    const button = css`
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      background: white;
      color: black;
      cursor: pointer;
      margin-left: 3px;
    `
    const tweetFnDeclaration = html`
      <script>
        function tweet() {
          const btn = document.getElementById("tweet-button");
          btn.textContent = "Fetching...";
          btn.disabled = true;
          btn.style.background = "#ddd";
        }
      </script>
    `

    return c.render(
      <>
        <h1 class={h1}>Tweet #nowplaying</h1>
        <div class={wrapper}>
          {tweetFnDeclaration}
          <form form action="/v1/tweet" method="get" onsubmit="tweet()">
            <label class={label}>
              <div>
                Spotify or Apple Music URL
              </div>
              <input class={textBox} type="text" name="url" />
            </label>
            <button class={button} type="submit" id="tweet-button">
              Tweet
            </button>
          </form>
        </div>
      </>
    )
  })