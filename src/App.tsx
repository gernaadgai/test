import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { NavigationBar } from './components/NavigationBar'
import { HomeScreen } from './screens/HomeScreen'
import { GerScreen } from './screens/GerScreen'
import { CollectionScreen } from './screens/CollectionScreen'
import { CharacterDetailScreen } from './screens/CharacterDetailScreen'
import { PlayScreen } from './screens/PlayScreen'
import { MiniGameScreen } from './screens/MiniGameScreen'
import { QuizScreen } from './screens/QuizScreen'
import { StoriesScreen } from './screens/StoriesScreen'
import { StoryReaderScreen } from './screens/StoryReaderScreen'
import { JourneyScreen } from './screens/JourneyScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ScanScreen } from './screens/ScanScreen'
import { MarketScreen } from './screens/MarketScreen'
import { ProductDetailScreen } from './screens/ProductDetailScreen'
import { CartScreen } from './screens/CartScreen'
import { CheckoutScreen } from './screens/CheckoutScreen'
import { OrderConfirmedScreen } from './screens/OrderConfirmedScreen'
import { ExchangeScreen } from './screens/ExchangeScreen'
import { WalletScreen } from './screens/WalletScreen'
import { ParentDashboardScreen } from './screens/ParentDashboardScreen'
import { GalleryScreen } from './screens/GalleryScreen'

const TAB_PATHS = new Set(['/', '/ger', '/collection', '/play', '/scan', '/stories', '/journey', '/profile', '/market'])

function AnimatedRoutes() {
  const location = useLocation()
  const showNav = TAB_PATHS.has(location.pathname)

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={showNav ? 'pb-24' : ''}
        >
          <Routes location={location}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/ger" element={<GerScreen />} />
            <Route path="/collection" element={<CollectionScreen />} />
            <Route path="/collection/:id" element={<CharacterDetailScreen />} />
            <Route path="/play" element={<PlayScreen />} />
            <Route path="/play/quiz" element={<QuizScreen />} />
            <Route path="/play/:id" element={<MiniGameScreen />} />
            <Route path="/stories" element={<StoriesScreen />} />
            <Route path="/stories/:id" element={<StoryReaderScreen />} />
            <Route path="/journey" element={<JourneyScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/market" element={<MarketScreen />} />
            <Route path="/market/cart" element={<CartScreen />} />
            <Route path="/market/checkout" element={<CheckoutScreen />} />
            <Route path="/market/order-confirmed" element={<OrderConfirmedScreen />} />
            <Route path="/market/exchange" element={<ExchangeScreen />} />
            <Route path="/market/:id" element={<ProductDetailScreen />} />
            <Route path="/wallet" element={<WalletScreen />} />
            <Route path="/parent" element={<ParentDashboardScreen />} />
            <Route path="/gallery" element={<GalleryScreen />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showNav && <NavigationBar />}
    </>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <div className="app-shell">
          <AnimatedRoutes />
        </div>
      </HashRouter>
    </MotionConfig>
  )
}

export default App
