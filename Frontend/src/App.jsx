import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Nav";

import Home from "./pages/Home";
import Women from "./pages/Women/WomenLayout";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Paypal from "./pages/Paypal"
import OrderHistory from './components/OrderHistory';

//Login and Signup Pages
import Login from "./pages/login";
import Signup from "./pages/Signup";


// Kids Product Detail Pages

import BoyswearDetail from "./pages/Kids/details/BoyWearDetail";
import GirlwearDetail from "./pages/Kids/details/GirlWearDetail";



// Men Product Detail Pages
import ShoeDetail from "./pages/Men/details/ShoeDetails";
import WatchDetail from "./pages/Men/details/WatchDetail";
import PantDetail from "./pages/Men/details/PantDetail";
import TraditionalDetail from "./pages/Men/details/Traditional";
import ShirtDetail from "./pages/Men/details/ShirtDetails";
import TshirtDetail from "./pages/Men/details/TshirtDetails";
import ShortDetail from "./pages/Men/details/ShortsDetails";
import TrackDetail from "./pages/Men/details/TracksDetail";


//Women Product Detail Pages
import WomenShoeDetail from "./pages/Women/deatils/ShoeDetails";
import WomenWatchDetail from "./pages/Women/deatils/WatchDetail";
import EthnicWearDetail from "./pages/Women/deatils/EthnicWearDetail"
import OutwearDetail from "./pages/Women/deatils/OutwearDetail";
import WesternDetail from "./pages/Women/deatils/WesternWearDetail";
import TopsBottomDetail from "./pages/Women/deatils/TopsBottomDetails"




// Kids Section Layout and Pages
import KidLayout from "./pages/kids/KidLayout";
import BoyWear from "./pages/kids/Boywear";
import GirlWear from "./pages/kids/Girlwear";




// Men Section Layout and Pages
import MenLayout from "./pages/Men/MenLayout";
import MenShoe from "./pages/Men/Shoe";
import MenWatches from "./pages/Men/Watches";
import MenPant from "./pages/Men/Pant";
import MenTraditional from "./pages/Men/Tradinational";
import MenShirt from "./pages/Men/Shirt";
import MenTshirts from "./pages/Men/T-shirt";
import MenShorts from "./pages/Men/Short";
import MenTracks from "./pages/Men/Track";


// Women Section Layout and Pages
import WomenLayout from "./pages/Women/WomenLayout";
import WomenShoe from "./pages/Women/Shoe";
import WomenWatches from "./pages/Women/Watches";
import WomenEthnicwear from "./pages/Women/Ethnicwear";
import WomenWesternwear from "./pages/Women/Western";
import WomenOutwear from "./pages/Women/Outwears";
import WomenTopBotton from "./pages/Women/Top&Bottom";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/Women" element={<Women />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Paypal />} />
        <Route path="/orders" element={<OrderHistory />} />



        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* General Product Details */}
        <Route path="/product/:productId" element={<ProductDetail />} />


        
        {/* Kids Product Detail Pages */}
        <Route path="/kids/boyswear/:productId" element={<BoyswearDetail />} />
        <Route path="/kids/girlwear/:productId" element={<GirlwearDetail />} />



        {/*Men Product Detail Pages*/}
        <Route path="/shoes/:productId" element={<ShoeDetail />} />
        <Route path="/watches/:productId" element={<WatchDetail />} />
        <Route path="/pants/:productId" element={<PantDetail />} />
        <Route path="/traditional/:productId" element={<TraditionalDetail />} />
        <Route path="/shirts/:productId" element={<ShirtDetail />} />
        <Route path="/tshirts/:productId" element={<TshirtDetail />} />
        <Route path="/shorts/:productId" element={<ShortDetail />} />
        <Route path="/tracks/:productId" element={<TrackDetail />} /> {/* ✅ Added */}


        {/*Women Product Detail Pages*/}
        <Route path="/women/shoes/:productId" element={<WomenShoeDetail />} />
        <Route path="/women/watches/:productId" element={<WomenWatchDetail />} />
        <Route path="/women/ethnic/:productId" element={<EthnicWearDetail />} />
        <Route path="/women/outwear/:productId" element={<OutwearDetail />} />
        <Route path="/women/western/:productId" element={<WesternDetail />} />
        <Route path="/women/topsbottom/:productId" element={<TopsBottomDetail />} />



        {/* Kids Routes */}
        <Route path="/kids" element={<KidLayout />}>
          <Route index element={<BoyWear />} />
          <Route path="boywear" element={<BoyWear />} />
          <Route path="girlwear" element={<GirlWear />} />
        </Route>



        {/* Men Routes */}
        <Route path="/men" element={<MenLayout />}>
          <Route index element={<MenShoe />} />
          <Route path="shoes" element={<MenShoe />} />
          <Route path="watches" element={<MenWatches />} />
          <Route path="pant" element={<MenPant />} />
          <Route path="traditional" element={<MenTraditional />} />
          <Route path="shirt" element={<MenShirt />} />
          <Route path="t-shirts" element={<MenTshirts />} />
          <Route path="shorts" element={<MenShorts />} />
          <Route path="tracks" element={<MenTracks />} /> {/* ✅ Added */}
        </Route>



        {/* Women Routes */}
      <Route path="/women" element={<WomenLayout />}>
        <Route index element={<WomenShoe />} />
        <Route path="shoes" element={<WomenShoe />} />
        <Route path="watches" element={<WomenWatches />} />
        <Route path="ethnic" element={<WomenEthnicwear />} />
        <Route path="outwear" element={<WomenOutwear />} />
        <Route path="western" element={<WomenWesternwear />} />
        <Route path="top&bottom" element={<WomenTopBotton />} />
      </Route>


        {/* Fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
