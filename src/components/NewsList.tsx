import { Card, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { saveNews } from "../store/news"
import { NewsCard } from "./NewsCard"

export const NewsList = () => {

    const { data, loading } = useSelector((state: RootState) => state.news);
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(saveNews())
    }, [])

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
                        return (<NewsCard item={item} key={item.id} />)
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
        </Content>

    )
}