// Adapted from GitBase src/components/Layout.js.
import { Navigation } from './Navigation';
import { Footer } from './Footer';
export function Layout({children}) { return <><Navigation/><main>{children}</main><Footer/></>; }
