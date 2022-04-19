import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin'
import Mobile from './Mobile'
import WideScreen from './WideScreen'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

export { WideScreen, Mobile }
