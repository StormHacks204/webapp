import NavigationBar from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
    <div className="bg-black min-h-screen">
      <BrowserRouter>
      <NavigationBar activeRoute={window.location.pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
      </BrowserRouter>
      </div>
      <header>
      {/* <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <NavigationBar/>
  </SignedIn> */}
    </header> 
    </>
  );
}