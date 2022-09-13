import type { AppProps } from "next/app"
import Layout from "../components/Layout"
import "../styles/globals.css"

function App({ Component, pageProps }: AppProps) {
  // My gut says that order matters here. It makes sense that we should have Auth before Database.
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
