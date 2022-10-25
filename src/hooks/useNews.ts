import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { saveNews } from "../store/news";

export const useNews = () => {
    const data = useSelector((state: RootState) => state.news);
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (!data.data || !data.data.length)
            dispatch(saveNews())
        // eslint-disable-next-line
    }, [])

    return data
}

