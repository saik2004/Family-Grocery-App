# 🛒 Family Grocery App



A simple full-stack app that stopped my parents from arguing over forgotten groceries.

Mom adds products whenever she remembers, Dad sees the list on his way home, and nobody gets interrupted at work.

## The Problem

Mom would remember items only after Dad had left for the shop or for work. That meant repeated phone calls during his job, missed items, and arguments at home. This app replaces those calls with a shared list.

<img width="1280" height="720" alt="GrocerryApp" src="https://github.com/user-attachments/assets/926200c0-0976-4251-b3b6-dbed65ff0340" />


## How It Works

1. **Mom adds products** (name, quantity, image) to a **draft box**. The draft lives in React state until she sends it.
2. **Mom sends the list**, and it appears in Dad's section.
3. **Dad sees** each product with its quantity and the time it was sent.
4. **Dad taps a product** to move it to the **Bought list**.
5. Both parents can open either section, so Mom can check what has been bought without calling anyone.

## Features

- Draft box to build a list before sending
- Product images, quantity and timestamps
- Separate Mom and Dad sections, viewable by both
- Tap-to-buy: items move from the pending list to the bought list
- Works on mobile browsers, so Mom can add items from anywhere with internet

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React                       |
| Backend  | Node.js, Express            |
| Database | MongoDB Atlas (via Mongoose) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/saik2004/Family-Grocery-App.git
cd <Family-Grocery-App>
```

### 2. Set up MongoDB Atlas (your own database)

1. Sign in at [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free **M0** cluster.
2. Go to **Database Access** and create a database user with a username and password.
3. Go to **Network Access** and click **Add IP Address**. Add your current IP, or `0.0.0.0/0` for development only.
4. Go to **Database → Connect → Drivers** and copy your connection string. It looks like this:

```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Replace `<username>`, `<password>` and `<database-name>` with your own values. If your password has special characters, URL-encode them.

### 3. Set up the backend

```bash
cd server
npm install
```

Create a file named `.env` inside the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Start the server:

```bash
npm run dev
```

You should see a "MongoDB connected" message in the terminal. If your project has no `dev` script, use `npm start` instead.

### 4. Set up the frontend

Open a new terminal window:

```bash
cd client
npm install
```

Create a file named `.env` inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

If your project was created with Create React App, use `REACT_APP_API_URL` instead of `VITE_API_URL`.

Start the app:

```bash
npm run dev
```

If your project uses Create React App, use `npm start`.

### 5. Open the app

Go to the address printed in the terminal, usually `http://localhost:5173` for Vite or `http://localhost:3000` for Create React App.

## Scripts

| Command           | What it does                  |
| ----------------- | ----------------------------- |
| `npm install`     | Installs dependencies         |
| `npm run dev`     | Starts the dev server         |
| `npm run build`   | Builds the frontend for production |

## Project Structure

```
<your-repo-name>/
├── client/          # React frontend
│   ├── src/
│   └── package.json
├── server/          # Express + MongoDB backend
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Environment Variables

Never commit your `.env` files. Add this to `.gitignore`:

```
.env
node_modules/
```

| Variable       | Location | Description                          |
| -------------- | -------- | ------------------------------------ |
| `PORT`         | server   | Port the API runs on                 |
| `MONGO_URI`    | server   | Your MongoDB Atlas connection string |
| `VITE_API_URL` | client   | URL of the backend API               |

## Troubleshooting

- **`MongoServerError: bad auth`**: the username or password in `MONGO_URI` is wrong, or special characters in the password are not URL-encoded.
- **`MongooseServerSelectionError`**: your IP is not allowed. Add it under Network Access in Atlas.
- **Frontend cannot reach the API**: check that the server is running and that the API URL in the client `.env` matches the server port. Restart the dev server after editing `.env`.

## Future Improvements

- Push notification to Dad when Mom sends a new list
- Login so each family has its own private lists
- Edit and delete items from a sent list

## Author

**Sai** ([@saik2004](https://github.com/saik2004)), a fresher React developer from Chennai, built this for his own family.

Feedback and ideas are welcome. Feel free to open an issue.
