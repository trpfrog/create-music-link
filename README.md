# create-music-link

Create music links for various music streaming services powered by [Lynkify](https://lynkify.in/).

https://create-music-link.trpfrog.workers.dev

## API

### GET /v1/tweet

### POST /v1

#### Request

```json
{
  "url": "<Spotify or Apple Music link>"
}
```

#### Response

```json
{
  "url": "<Lynkify link>"
}
```

#### Example

```bash
$ curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"url": "https://music.apple.com/jp/album/distortion/1657318546?i=1657318564"}' \
    https://create-music-link.trpfrog.workers.dev/v1

{"url":"https://lynkify.in/song/distortion/57318564"}
```

## Recipes

This iOS shortcut creates a #nowplaying tweet with a Lynkify link to the currently playing song.

https://www.icloud.com/shortcuts/dc244efad20a47a69443ee9b61a8e3fc
