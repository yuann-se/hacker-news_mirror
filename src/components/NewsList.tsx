import { Card, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { Link, Route, Switch, useRouteMatch } from "react-router-dom"
import { NewsCard } from "./NewsCard"
import urlSlug from 'url-slug'
import { NewsDetails } from "./NewsDetails"
import { useNews } from "../hooks/useNews"
import { useEffect, useRef, useState } from "react"
import { saveNews } from "../store/news"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"

export const NewsList = () => {

  const [count, setCount] = useState<number>(0)
  const { newsData, newsLoading } = useNews()
  const { idsList, idsLoading } = useSelector((state: RootState) => state.idsList)
  const { path, url } = useRouteMatch();
  const dispatch = useDispatch<AppDispatch>()
  const [bottomOfList, setBottomOfList] = useState<HTMLLIElement | null>(null);

  // Здесь идет подгрузка следующих 20 новостей при скролле до конца страницы
  const observer = useRef(
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setCount((prev) => ++prev)
    }, { rootMargin: '500px' }))

  // апи дает 500 новостей, это 25 страниц (отсчет страниц от 1)
  useEffect(() => {
    if (count <= 25 && idsList.length) dispatch(saveNews(count))
    // eslint-disable-next-line
  }, [count])

  useEffect(() => {
    const currentObserver = observer.current

    if (bottomOfList) currentObserver.observe(bottomOfList)

    return () => {
      if (bottomOfList) currentObserver.unobserve(bottomOfList)
    }
  }, [bottomOfList])

  return (
    <Content>
      <div className="container" style={{ paddingBottom: 30 }}>

        {newsData.map((item) => {
          return (<Link to={`${url}/${urlSlug(item.title!)}?id=${item.id}`} key={item.id}><NewsCard item={item} /></Link>)
        })}

        {!newsLoading && !idsLoading && (<li ref={setBottomOfList}></li>)}

        {newsLoading && (
          [...Array(10)].map((_, ind) => {
            return (<Card style={{ marginTop: 30 }} key={ind}>
              <Skeleton loading={newsLoading} title active paragraph={{ rows: 1 }} />
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
