import { useComments } from "../hooks/useComments"
import { Comment, Divider, Empty, Skeleton } from 'antd'
import { Fragment, useEffect, useState } from "react"
import { timeSince } from "../utils/timeSince"
import { IItem } from "hacker-news-api-types"

interface IProps {
    story: IItem
    isRoot: boolean
    onLoad?: (num: number) => void
}

export const CommentsBlock = ({ story, isRoot, onLoad }: IProps) => {

    const { commentsData, loading } = useComments({ story, isRoot })

    interface IIsOpen {
        [id: number]: boolean
    }
    const [isOpen, setIsOpen] = useState<IIsOpen>({})

    // Считаем количество корневых комментариев без учета удаленных
    useEffect(() => {
        if (isRoot && onLoad && commentsData[story.id]) {
            onLoad((commentsData[story.id].filter((item) => !item.dead && !item.deleted)).length)
        }
    })

    return (
        <Fragment>

            {!story.kids?.length && isRoot && (
                <Empty />
            )}

            {commentsData[story.id] && (
                commentsData[story.id].map((item) => {

                    // Рендерим только неудаленные комментарии
                    if (!item.deleted && !item.dead) {
                        return (<Fragment key={item.id}>
                            <Comment
                                author={item.by}
                                content={<p dangerouslySetInnerHTML={{ __html: item.text || '' }}></p>}
                                datetime={<span>{timeSince(item.time?.toString() || '')}</span>}
                            >
                                {(isOpen[item.id] || !isRoot) && (
                                    <CommentsBlock story={item} isRoot={false} />
                                )}

                            </Comment>
                            {item.kids && isRoot && (
                                <div onClick={() => setIsOpen({ ...isOpen, [item.id]: isOpen[item.id] ? false : true })}>
                                    <Divider className="comment-divider" orientation="left" plain>{isOpen[item.id] ? 'Hide' : 'Show more'}</Divider>
                                </div>
                            )}

                            <Skeleton loading={loading} active avatar paragraph={{ rows: 2 }}></Skeleton>

                        </Fragment>
                        )
                    }
                }))}
        </Fragment>
    )
}