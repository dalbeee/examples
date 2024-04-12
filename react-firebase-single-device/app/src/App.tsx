import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./auth/SignIn";
import AuthProvider, { useAuth } from "./auth/AuthProvider";
import { Button } from "@mui/material";

function Menu() {
  const { user, handleSignOut } = useAuth();

  return (
    <div>
      <Button href="/">Home</Button>
      {user ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button href="/signIn">Sign In</Button>
      )}
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  );
}

function Main() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/Main.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/signIn", element: <SignIn /> },
      { path: "*", element: <Main /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
