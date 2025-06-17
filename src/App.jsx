import "./App.css";
import { ListOfPhotos } from "./components/ListOfPhotos/ListOfPhotos.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PhotoDetails } from "./components/PhotoDetails/PhotoDetails.jsx";
import { Header } from "./components/Header/Header.jsx";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListOfPhotos />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
