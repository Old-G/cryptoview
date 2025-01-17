import { LayoutDashboard, UserCircle } from 'lucide-react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { createThirdwebClient } from 'thirdweb'
import { ConnectButton } from 'thirdweb/react'
import { createWallet, inAppWallet } from 'thirdweb/wallets'
import Sidebar, { SidebarItem } from './components/Sidebar'
import Detailed from './pages/Detailed.jsx'
import Home from './pages/Home.jsx'
import Trading from './pages/Trading.jsx'

const client = createThirdwebClient({
	clientId: '1b1e02b0a86b8e6819a1798f30b6d76b',
})

const wallets = [
	inAppWallet({
		auth: {
			options: [
				'google',
				'discord',
				'telegram',
				'email',
				'x',
				'passkey',
				'phone',
			],
		},
	}),
	createWallet('io.metamask'),
	createWallet('com.coinbase.wallet'),
	createWallet('me.rainbow'),
	createWallet('io.rabby'),
	createWallet('io.zerion.wallet'),
	createWallet('com.binance'),
	createWallet('com.trustwallet.app'),
]

function App() {
	return (
		<Router>
			<div className='flex'>
				<Sidebar>
					<SidebarItem
						to='/'
						icon={<LayoutDashboard size={20} />}
						text='Home'
					/>
					<SidebarItem
						icon={<UserCircle size={20} />}
						text='Trading'
						to='/Trading'
					/>
					<hr className='my-3' />

					<ConnectButton
						client={client}
						wallets={wallets}
						connectModal={{ size: 'compact' }}
					/>
				</Sidebar>
				<Routes>
					<Route path='/' element={<Home />}></Route>
					<Route path='/page/:pageNumber' element={<Home />}></Route>
					<Route path='/categories' element={<Home />}></Route>
					<Route path='/Trading' element={<Trading />}></Route>
					<Route path='/:id' element={<Detailed />}></Route>
				</Routes>
			</div>
		</Router>
	)
}

export default App
