# schema

[![Build Status][build-status-image]][build-status]

The contract between forte's clients and backend. Interaction happens over
[GraphQL][graphql] and HTTP. Includes [fixtures] and [tools for testing
resolvers][tests].

## Remote Resources

Some resources cannot be sent in the GraphQL response like audio and image data.
This data is hosted by the server. Sometimes, a URL pointing the resource is
provided by a GraphQL field, for example `Album.artworkUrl`. These URLs
are relative to the configured server url. Other resources are accessible at
pre-defined URLs.

## Authentication

Currently there is no user access control or authentication. It is assumed that
there is only one user, anyone who can access the API. This will change soon.

## Album Artwork

Album artwork is exposed through the GraphQL API in the `Album.artworkUrl`
field. The song can be retrived by making a HTTP GET request to the endpoint.

### Authentication

The same authentication used to communicate with the API should be used when
contacting the album artwork endpoint.

### Discovery

Album artwork is considered from a number of places when building the music
index:

1. The first album artwork embedded in the tag metadata for an album is
   considered.

2. If there aren't any embedded album artworks embedded in the tags for an
   album's songs or there is a higher quality image file in the same directory,
   the image in the directory will be used.

### Formats

The artwork will always be a square png of the best resolution available.

## Song Metadata

### Discovery

This endpoint is available over HTTP/HTTPS. Songs are discovered at crawl time
and indexed based on their tags. No guessing or inference is done based on the
filename. Other tools like [lltag] are available to rescue badly tagged songs.

### Formats

Forte supports crawling audio contained in mp3, m4a and flac containers.

## Songs

Songs (bytes representing the audio) are exposed through the following
endpoints:

| Path                       |                                                           |
| :------------------------- | :-------------------------------------------------------- |
| `/files/music/{id}/raw`    | Original, un-transcoded song which was imported by forte. |
| `/files/music/{id}/mp3/v0` | Transcoded to MP3 VBR V0 quality                          |
| `/files/music/{id}/aac/v5` | Transcoded to AAC VBR V5 quality                          |

The song can be retrived by making a HTTP GET request to the desired endpoint.

### Authentication

The same authentication used to communicate with the API should be used when
contacting the song streaming endpoint.

### Formats

This endpoint is available over HTTP/HTTPS. This endpoint **MUST** support HTTP
206 partial responses and random access reads.

By default forte will stream audio file it indexed. Forte supports streaming any
of the containers it can index. These formats are widely supported but in some
cases (bandwith constrained environments like mobile) transcoding is desired.

forte supports transcoding to constant bit rate AAC with the m4a container by
adding the `transcode` query parameter with a value of the desired bitrate.

[graphql]: http://graphql.org/
[lltag]: https://github.com/bgoglin/lltag
[build-status-image]: https://img.shields.io/circleci/project/github/forte-music/schema/master.svg
[build-status]: https://circleci.com/gh/forte-music/schema
[fixtures]: ./fixtures
[tests]: ./tests
