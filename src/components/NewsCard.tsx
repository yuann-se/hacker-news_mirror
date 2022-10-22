import { UserOutlined, ClockCircleOutlined, StockOutlined } from "@ant-design/icons"
import { Card, Space } from "antd"
import { IItem } from "hacker-news-api-types";

const timeSince = (date: string) => {
    const now = new Date();
    const nowSeconds = now.getTime();
    const dateSec = Number(date) * 1000;
    const seconds = Math.floor((nowSeconds - dateSec) / 1000);

    let interval = Math.floor(seconds / 86400);
    if (interval >= 1 && interval <= 6) {
        if (interval === 1) return `${interval} day ago`
        else return `${interval} days ago`
    } else if (interval > 6) {
        let created = new Date(dateSec);
        return created.toLocaleDateString();
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        if (interval === 1) return `${interval} hour ago`
        else return `${interval} hours ago`
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        if (interval === 1) return `${interval} minute ago`
        else return `${interval} minutes ago`
    } else if (interval < 1) return 'less than a minute ago'
}

interface IProps {
    item: IItem
}

export const NewsCard = ({ item }: IProps) => {
    return (
        <Card
            style={{ marginTop: 30 }}
            key={item.id}
            title={item.title}
        >
            <Space size='large'>
                <span>
                    <Space>
                        <UserOutlined />
                        <span>{item.by}</span>
                    </Space>
                </span>
                <span>
                    <Space>
                        <ClockCircleOutlined />
                        <span>Published {timeSince(item.time!.toString())}</span>
                    </Space>
                </span>
                <span>
                    <Space>
                        <StockOutlined />
                        <span>{item.score}</span>
                    </Space>
                </span>
            </Space>
        </Card>
    )
}