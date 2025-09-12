# Jsonplaceholder Posts and Users App

A simple posts and users management app built with **React**, **TypeScript**, **TailwindCSS**, **DaisyUI**, and **TanStack Query**.

Supports adding, editing, and deleting posts/users with smooth updates and optimistic UI.

---

## Tech Stack

- [React](https://react.dev/) – UI framework

- [TypeScript](https://www.typescriptlang.org/) – Strong typing

- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS

- [DaisyUI](https://daisyui.com/) – TailwindCSS component library

- [TanStack Query](https://tanstack.com/query/latest) – Data fetching, caching, and state management

- [pnpm](https://pnpm.io/) – Fast package manager

---

## Features

- Add, edit, and delete posts and users

- Optimistic updates with TanStack Query

- Smooth scroll to newly added posts/users

- Highlight animation on new rows

- Light/Dark theme switcher using Tailwind + DaisyUI

- Type-safe API integration

---

## Project Structure

```bash
src/
├── components/ # Reusable UI components (Table, Button, Modal, etc.)
├── lib/ # Custom hooks
└── pages/ # Page-level components (PostsPage, UsersPage)
```

---

## Installation

Make sure you have **pnpm** installed:

```bash
npm  install  -g  pnpm
```

Clone the repo and install dependencies:

```bash
git  clone  https://github.com/okanocodes/react-jsonplaceholder-project.git

cd  react-jsonplaceholder-project

pnpm  install
```

## Development

Start the development server:

```bash
pnpm  dev
```

## Build

Create a production build:

```bash
pnpm  build
```

Preview the production build:

```bash
pnpm  preview
```
