import { Card, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { Link, Route, Switch, useRouteMatch } from "react-router-dom"
import { NewsCard } from "./NewsCard"
import urlSlug from 'url-slug'
import { NewsDetails } from "./NewsDetails"
import { useNews } from "../hooks/useNews"
import { useEffect } from "react"
import { saveNews } from "../store/news"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store"

export const NewsList = () => {

    const { data, loading } = useNews()
    const { path, url } = useRouteMatch();
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const updateData = setTimeout(() => {
            dispatch(saveNews());
        }, 60000);
        return (() => clearTimeout(updateData))
    })

    return (
        <Content>
            <div className="container" style={{ paddingBottom: 30 }}>
                {!loading && (
                    data.map((item) => {
                        return (<Link to={`${url}/${urlSlug(item.title!)}?id=${item.id}`} key={item.id}><NewsCard item={item} /></Link>)
                    })
                )}

                {loading && (
                    [...Array(10)].map((_, ind) => {
                        return (<Card style={{ marginTop: 30 }} key={ind}>
                            <Skeleton loading={loading} title active paragraph={{ rows: 1 }} />
                        </Card>)
                    })
                )}
            </div>

            <Switch>
                <Route path={`${path}/:id`}>
                    <NewsDetails />
                </Route>
            </Switch>
        </Content>
    )
}