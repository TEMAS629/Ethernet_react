import { BrowserRouter } from "react-router-dom";

import './App.css'
import AppRouter from './AppRouter.jsx'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

export default function App() {

  return (
    <>
      <Header />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Footer />
    </>
  )
}
