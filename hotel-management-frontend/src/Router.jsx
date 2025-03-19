import { BrowserRouter, Route, Routes } from "react-router-dom"
import HotelDetails from "./components/Hotel/HotelDetails"

import PrivateRoute from "./PrivateRoute"
import About from "./pages/about/About"
import Contact from "./pages/contact/Contact"
import Home from "./pages/home/Home"
import Hotels from "./pages/hotel/Hotels"
import Dashboard from "./pages/dashboard/Dashboard";
import AddHotel from "./pages/hotel/AddHotel/AddHotel"
import UpdateHotel from "./pages/hotel/updateHotel/UpdateHotel"
import SignUp from "./pages/singUp/SignUp"
import SignIn from "./pages/signIn/SignIn"

export default function AppRoute() {
  return (
    <BrowserRouter>
    <Routes>
     <Route  path='/' element={<Home/>}/>
     <Route path="/hotels/:id" element={<HotelDetails />} />
     <Route path="/login" element={<SignIn />} />
     <Route path="/register" element={<SignUp />} />
     <Route path="/about" element={<About />} />
     <Route path="/contact" element={<Contact />} />
     <Route path="/hotels" element={<Hotels />} />
     <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }/>
                <Route path="/hotels/create" element={
                    <PrivateRoute>
                        <AddHotel/>
                    </PrivateRoute>
                }/>
                <Route path="/hotels/edit/:id" element={
                    <PrivateRoute>
                        <UpdateHotel />
                    </PrivateRoute>
                }/>
    </Routes>
  </BrowserRouter>
  )
}