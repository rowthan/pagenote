import NotionDoc, { NotionDocProp } from 'components/notion/NotionDoc'
import {
    getNotionDocDetail,
} from '../../service/server/doc'
import NotFound from 'components/error/NotFound'
import Footer from 'components/Footer'

export const getStaticPaths = (async () => {
    return {
        paths: [
            // {
            //     params: {
            //         id: '',
            //     },
            // }, // See the "paths" section below
        ],
        fallback: 'blocking', // false or "blocking"
    }
})

export async function getStaticProps(props: { params: { id: string } }) {
    const { params } = props
    return await getNotionDocDetail(params.id)
}

export default function Page(props: NotionDocProp) {
    const { recordMap, title, path, keywords, description } = props || {}
    if (!recordMap) {
        return (
            <div className={'h-screen'}>
                <NotFound />
                <Footer />
            </div>
        )
    }
    return (
        <NotionDoc
            recordMap={recordMap}
            title={title}
            path={path}
            keywords={keywords}
            description={description}
            />
)
}
