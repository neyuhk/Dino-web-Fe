import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { router } from './router'
import DefaultLayout from './layouts/DefaultLayout.tsx'
import NotFound from './pages/commons/NotFound.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {router.map((route: any, index: any) => {
                    const Layout = route.layout
                    const Page = route.component
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    )
                })}
                <Route
                    path="*"
                    element={
                        <DefaultLayout>
                            <NotFound />
                        </DefaultLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
