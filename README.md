# Lexitron core

## Overview

Lexitron is a tool for accessing information about English words, including
information like definitions, synonyms, rhymes, etymologies, and much more.

Lexitron will have at least three interfaces:
- A web interface, which is a web app at lexitron.org
- An API, served from api.lexitron.org
- A CLI, downloadable via `brew install lexitron` and runnable using the command `lx`

Lexitron might end up having some native databases but will mostly interface
with other services via their APIs in order to serve data to the end user.

## Stack

- Typescript
- Bun
- Next.js

## Local Development

1. Clone the repository:
```
git clone https://github.com/rothos/lexitron-core.git

```
